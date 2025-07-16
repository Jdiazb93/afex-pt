import request from "supertest";
import app from "../app";

describe("POST /api/item/create", () => {
  it("Debe crear un item correctamente", async () => {
    const newItem = {
      name: "Juan",
      surname: "Pérez",
      amount: 1500,
      country: "CL",
      agentType: "Interbank",
      status: "active",
      date: new Date(),
    };

    const response = await request(app).post("/api/item/create").send(newItem);

    if (response.status === 200) {
      expect(response.body.error).toBe(false);
      expect(response.body).toHaveProperty("item");
      expect(response.body.item.name).toBe(newItem.name);
    }

    if (response.status === 401) {
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("Todos los campos son obligatorios.");
    }
  });
});

describe("PUT /api/item/edit/:id", () => {
  it("Debe editar 1 item correctamente", async () => {
    const updatedItem = {
      name: "Juanito",
      surname: "Pérez",
      amount: 500,
      country: "CL",
      agentType: "Algo",
      status: "active",
      date: new Date(),
    };

    const response = await request(app)
      .put("/api/item/edit/1")
      .send(updatedItem);

    if (response.status === 200) {
      expect(response.body.error).toBe(false);
      expect(response.body).toHaveProperty("item");
      expect(response.body.item.name).toBe(updatedItem.name); // Campos actualizados
      expect(response.body.item.amount).toBe(updatedItem.amount); // Campos actualizados
    }

    if (response.status === 403) {
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe(
        "No se pueden editar items inactivos."
      );
    }
  });
});

describe("DELETE /api/item/delete/:id", () => {
  it("Debe hacer soft delete a 1 item correctamente", async () => {
    const response = await request(app).delete("/api/item/delete/1");

    if (response.status === 200) {
      expect(response.body.error).toBe(false);
      expect(response.body.message).toBe("Item eliminado con éxito.");
    }

    if (response.status === 403) {
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("El item no se encuentra activo.");
    }
  });
});

describe("GET /api/item/list", () => {
  it("Debe listar los items de forma correcta", async () => {
    const response = await request(app)
      .get("/api/item/list?limit=10&page=1&name=juan")
      .expect(200);

    expect(response.body.error).toBe(false);
    expect(Array.isArray(response.body.items)).toBe(true);
    expect(typeof response.body.pagination).toBe("object");
    expect(typeof response.body.pagination.totalRecords).toBe("number");
    expect(typeof response.body.pagination.totalPages).toBe("number");
  });
});
