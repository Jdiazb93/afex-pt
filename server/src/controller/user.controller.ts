import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { parse } from "date-fns";

const prisma = new PrismaClient();

export const CreateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, surname, amount, country, agentType } = req.body;

    if (!name || !surname || !amount || !country || !agentType) {
      res
        .status(401)
        .send({ error: true, message: "Todos los campos son obligatorios." });
      return;
    }

    const newUser = await prisma.users.create({
      data: {
        date: new Date(),
        agentType,
        amount,
        country,
        name,
        status: "active",
        surname,
      },
    });

    if (!newUser) {
      res
        .status(401)
        .send({ error: true, message: "Error al crear el usuario." });
      return;
    }

    res.status(200).send({
      error: false,
      message: "Usuario creado con éxito.",
      user: newUser,
    });
  } catch (err) {
    console.error("Ha ocurrido un error: ", err);
    res.status(500).send({
      error: true,
      message: "Error del servidor al crear el usuario.",
    });
  }
};

export const EditUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, surname, amount, country, agentType } = req.body;

    if (!id) {
      res.status(403).send({ error: true, message: "El id es obligatorio." });
      return;
    }

    // Se castea el id a número
    const idNum = parseInt(id as string);

    // Se valida que sea un número
    if (isNaN(idNum)) {
      res
        .status(400)
        .send({ error: true, message: "El id debe ser un número válido." });
      return;
    }

    const userFounded = await prisma.users.findUnique({
      where: { id: idNum },
    });

    if (!userFounded) {
      res.status(403).send({ error: true, message: "El usuario no existe." });
      return;
    }

    if (userFounded.status !== "active") {
      res.status(403).send({
        error: true,
        message: "No se pueden editar usuarios inactivos.",
      });
      return;
    }

    const userUpdated = await prisma.users.update({
      where: { id: idNum },
      data: {
        agentType,
        amount,
        country,
        date: new Date(),
        name,
        surname,
      },
    });

    if (!userUpdated) {
      res.status(401).send({
        error: true,
        message: "Ha ocurrido un error al editar el usuario.",
      });
      return;
    }

    res.status(200).send({
      error: false,
      message: "Usuario actualizado con éxito.",
      user: userUpdated,
    });
  } catch (err) {
    console.error("Ha ocurrido un error al editar usuario: ", err);
    res.status(500).send({
      error: true,
      message: "Error en el servidor al editar un usuario.",
    });
  }
};

export const DeleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(403).send({ error: true, message: "El id es obligatorio." });
      return;
    }

    // Se castea el id a número
    const idNum = parseInt(id as string);

    // Se valida que sea un número
    if (isNaN(idNum)) {
      res
        .status(400)
        .send({ error: true, message: "El id debe ser un número válido." });
      return;
    }

    const foundedUser = await prisma.users.findUnique({ where: { id: idNum } });

    if (!foundedUser) {
      res.status(403).send({ error: true, message: "Usuario no encontrado" });
      return;
    }

    if (foundedUser.status !== "active") {
      res
        .status(403)
        .send({ error: true, message: "El usuario no se encuentra activo." });
      return;
    }

    const userUpdated = await prisma.users.update({
      where: { id: idNum },
      data: { status: "inactive" },
    });

    if (!userUpdated) {
      res
        .status(403)
        .send({ error: true, message: "Error al eliminar el usuario." });
      return;
    }

    res
      .status(200)
      .send({ error: false, message: "Usuario eliminado con éxito." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: true, message: "" });
  }
};

export const ListUsers = async (req: Request, res: Response) => {
  try {
    const { limit, page, name, surname, country, status, startDate, endDate } =
      req.query;

    const limitNum = parseInt(limit as string) || 10; // valor por defecto 10
    const pageNum = parseInt(page as string) || 1; // valor por defecto 1

    if (isNaN(pageNum)) {
      res
        .status(400)
        .send({ error: true, message: "La página debe ser un número válido." });
      return;
    }
    if (isNaN(limitNum)) {
      res
        .status(400)
        .send({ error: true, message: "El limite debe ser un número válido." });
      return;
    }

    let parsedStartDate: Date | undefined;
    let parsedEndDate: Date | undefined;

    if (startDate) {
      parsedStartDate = parse(startDate as string, "dd/MM/yyyy", new Date());
    }
    if (endDate) {
      parsedEndDate = parse(endDate as string, "dd/MM/yyyy", new Date());
    }

    const filters: any = {
      ...(name && { name: { contains: name as string } }),
      ...(surname && {
        surname: { contains: surname as string },
      }),
      ...(country && { country: country as string }),
      ...(status && { status: status as string }),
      ...(parsedStartDate || parsedEndDate
        ? {
            date: {
              ...(parsedStartDate && { gte: parsedStartDate }),
              ...(parsedEndDate && { lte: parsedEndDate }),
            },
          }
        : {}),
    };

    const recordsFounded = await prisma.users.findMany({
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      where: filters,
      orderBy: {
        date: "asc",
      },
    });

    const totalRecords = await prisma.users.count({
      where: filters,
    });

    res.status(200).send({
      error: false,
      message: "",
      users: recordsFounded,
      pagination: {
        totalRecords,
        totalPages: Math.ceil(totalRecords / limitNum),
      },
    });
  } catch (err) {
    console.error("Ha ocurrido un error al listar usuarios: ", err);
    res.status(500).send({
      error: true,
      message: "Error del servidor al listar los usuarios.",
    });
  }
};

/**
 * Método auxiliar para pruebas unicamente (No conectado en Front)
 * Se utiliza para actualizar las fechas con formato "DD/MM/YYYY"
 * Ejemplo, actualizar la fecha del registro 1 al 01/07/2025
 * Esta función es porque SQLite no me permite modificar los datos a no ser que se pague premium.
 * Y necesito probar el filtro por rango de fechas.
 */
export const UpdateDate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date } = req.body;

    if (!id) {
      res.status(404).send({ error: true, message: "Se debe entregar id" });
      return;
    }

    const recordUpdated = await prisma.users.update({
      where: { id: parseInt(id as string) },
      data: { date: parse(date, "dd/MM/yyyy", new Date()) },
    });

    res.status(200).send({
      error: false,
      message: "Registro actualizado.",
      usuario: recordUpdated,
    });
  } catch (err) {
    console.error("Ha ocurrido un error al actualizar la fecha: ", err);
    res
      .status(500)
      .send({ error: true, message: "Error al actualizar la fecha." });
  }
};
