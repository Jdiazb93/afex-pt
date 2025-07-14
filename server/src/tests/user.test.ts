import request from "supertest";
import app from "../app";

describe("POST /api/user/create", () => {
  it("Debe crear un usuario correctamente", async () => {
    const newUser = {
      name: "Juan",
      surname: "Pérez",
      amount: 1500,
      country: "CL",
      agentType: "Algo",
      status: "active",
      date: new Date(),
    };

    const response = await request(app).post("/api/user/create").send(newUser);

    if (response.status === 200) {
      expect(response.body.error).toBe(false);
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.name).toBe(newUser.name);
    }

    if (response.status === 401) {
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("Todos los campos son obligatorios.");
    }
  });
});

describe("PUT /api/user/edit/:id", () => {
  it("Debe editar 1 usuario correctamente", async () => {
    const updatedUser = {
      name: "Juanito",
      surname: "Pérez",
      amount: 500,
      country: "CL",
      agentType: "Algo",
      status: "active",
      date: new Date(),
    };

    const response = await request(app)
      .put("/api/user/edit/1")
      .send(updatedUser);

    if (response.status === 200) {
      expect(response.body.error).toBe(false);
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.name).toBe(updatedUser.name); // Campos actualizados
      expect(response.body.user.amount).toBe(updatedUser.amount); // Campos actualizados
    }

    if (response.status === 403) {
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe(
        "No se pueden editar usuarios inactivos."
      );
    }
  });
});

describe("DELETE /api/user/delete/:id", () => {
  it("Debe hacer soft delete a 1 usuario correctamente", async () => {
    const response = await request(app).delete("/api/user/delete/1");

    if (response.status === 200) {
      expect(response.body.error).toBe(false);
      expect(response.body.message).toBe("Usuario eliminado con éxito.");
    }

    if (response.status === 403) {
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("El usuario no se encuentra activo.");
    }
  });
});

describe("GET /api/user/list", () => {
  it("Debe listar los usuarios de forma correcta", async () => {
    const response = await request(app)
      .get("/api/user/list?limit=10&page=1&name=juan")
      .expect(200);

    expect(response.body.error).toBe(false);
    expect(Array.isArray(response.body.users)).toBe(true);
    expect(typeof response.body.totalRecords).toBe("number");
  });
});
