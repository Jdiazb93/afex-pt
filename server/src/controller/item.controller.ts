import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { parse, startOfDay, endOfDay } from "date-fns";

const prisma = new PrismaClient();

export const CreateItem = async (
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

    const newItem = await prisma.items.create({
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

    if (!newItem) {
      res.status(401).send({ error: true, message: "Error al crear el item." });
      return;
    }

    res.status(200).send({
      error: false,
      message: "Item creado con éxito.",
      item: newItem,
    });
  } catch (err) {
    console.error("Ha ocurrido un error: ", err);
    res.status(500).send({
      error: true,
      message: "Error del servidor al crear el item.",
    });
  }
};

export const EditItem = async (req: Request, res: Response): Promise<void> => {
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

    const itemFounded = await prisma.items.findUnique({
      where: { id: idNum },
    });

    if (!itemFounded) {
      res.status(403).send({ error: true, message: "El item no existe." });
      return;
    }

    if (itemFounded.status !== "active") {
      res.status(403).send({
        error: true,
        message: "No se pueden editar items inactivos.",
      });
      return;
    }

    const itemUpdated = await prisma.items.update({
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

    if (!itemUpdated) {
      res.status(401).send({
        error: true,
        message: "Ha ocurrido un error al editar el item.",
      });
      return;
    }

    res.status(200).send({
      error: false,
      message: "Item actualizado con éxito.",
      item: itemUpdated,
    });
  } catch (err) {
    console.error("Ha ocurrido un error al editar item: ", err);
    res.status(500).send({
      error: true,
      message: "Error en el servidor al editar un item.",
    });
  }
};

export const DeleteItem = async (
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

    const foundedItem = await prisma.items.findUnique({ where: { id: idNum } });

    if (!foundedItem) {
      res.status(403).send({ error: true, message: "Item no encontrado" });
      return;
    }

    if (foundedItem.status !== "active") {
      res
        .status(403)
        .send({ error: true, message: "El item no se encuentra activo." });
      return;
    }

    const itemUpdated = await prisma.items.update({
      where: { id: idNum },
      data: { status: "inactive" },
    });

    if (!itemUpdated) {
      res
        .status(403)
        .send({ error: true, message: "Error al eliminar el item." });
      return;
    }

    res
      .status(200)
      .send({ error: false, message: "Item eliminado con éxito." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ error: true, message: "Error del servidor al eliminar un item" });
  }
};

export const ListItems = async (req: Request, res: Response) => {
  try {
    const {
      limit,
      page,
      name,
      surname,
      country,
      status,
      agentType,
      minAmount,
      maxAmount,
      startDate,
      endDate,
    } = req.query;

    const limitNum = parseInt(limit as string) || 10;
    const pageNum = parseInt(page as string) || 1;

    if (isNaN(pageNum)) {
      return res
        .status(400)
        .send({ error: true, message: "La página debe ser un número válido." });
    }
    if (isNaN(limitNum)) {
      return res
        .status(400)
        .send({ error: true, message: "El límite debe ser un número válido." });
    }

    // Manejo de fechas
    const startDateStr = startDate as string;
    const endDateStr = endDate as string;

    let parsedStartDate: Date | undefined;
    let parsedEndDate: Date | undefined;

    if (startDateStr) {
      const rawStart = parse(startDateStr, "dd/MM/yyyy", new Date());
      parsedStartDate = startOfDay(rawStart);
    }
    if (endDateStr) {
      const rawEnd = parse(endDateStr, "dd/MM/yyyy", new Date());
      parsedEndDate = endOfDay(rawEnd);
    }

    const parsedCountry = Array.isArray(country)
      ? country
      : country
      ? [country]
      : "";
    const parsedStatus = Array.isArray(status)
      ? status
      : status
      ? [status]
      : "";
    const parsedAgentType = Array.isArray(agentType)
      ? agentType
      : agentType
      ? [agentType]
      : "";

    const parsedMinAmount = minAmount
      ? parseInt(minAmount as string)
      : undefined;
    const parsedMaxAmount = maxAmount
      ? parseInt(maxAmount as string)
      : undefined;

    // Construcción dinámica del filtro
    const filters: any = {
      ...(name && { name: { contains: name as string } }),
      ...(surname && { surname: { contains: surname as string } }),
      ...(parsedCountry && { country: { in: parsedCountry } }),
      ...(parsedStatus && { status: { in: parsedStatus } }),
      ...(parsedAgentType && { agentType: { in: parsedAgentType } }),
      ...(parsedStartDate || parsedEndDate
        ? {
            date: {
              ...(parsedStartDate && { gte: parsedStartDate }),
              ...(parsedEndDate && { lte: parsedEndDate }),
            },
          }
        : {}),
      ...(parsedMinAmount !== undefined || parsedMaxAmount !== undefined
        ? {
            amount: {
              ...(parsedMinAmount !== undefined && { gte: parsedMinAmount }),
              ...(parsedMaxAmount !== undefined && { lte: parsedMaxAmount }),
            },
          }
        : {}),
    };

    const recordsFounded = await prisma.items.findMany({
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      where: filters,
      orderBy: {
        date: "desc",
      },
    });

    const totalRecords = await prisma.items.count({
      where: filters,
    });

    return res.status(200).send({
      error: false,
      message: "",
      items: recordsFounded,
      pagination: {
        totalRecords,
        totalPages: Math.ceil(totalRecords / limitNum),
      },
    });
  } catch (err) {
    console.error("Ha ocurrido un error al listar items: ", err);
    return res.status(500).send({
      error: true,
      message: "Error del servidor al listar los items.",
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

    const recordUpdated = await prisma.items.update({
      where: { id: parseInt(id as string) },
      data: { date: parse(date, "dd/MM/yyyy", new Date()) },
    });

    res.status(200).send({
      error: false,
      message: "Registro actualizado.",
      item: recordUpdated,
    });
  } catch (err) {
    console.error("Ha ocurrido un error al actualizar la fecha: ", err);
    res
      .status(500)
      .send({ error: true, message: "Error al actualizar la fecha." });
  }
};
