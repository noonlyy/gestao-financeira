import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const router = Router();
const prisma = new PrismaClient();

// -------------------------------------------------------------
// SCHEMAS DE VALIDAÇÃO (ZOD)
// -------------------------------------------------------------
const createCategorySchema = z.object({
  name: z.string({ required_error: "O nome é obrigatório" }),
  displayName: z.string({ required_error: "O nome de exibição é obrigatório" }),
  icon: z.string({ required_error: "O ícone é obrigatório" }),
  background: z.string({ required_error: "A cor de fundo é obrigatória" }),
  isIncome: z.boolean({ required_error: "isIncome precisa ser um booleano (true ou false)" }),
});

const updateCategorySchema = z.object({
  displayName: z.string().optional(),
});

// -------------------------------------------------------------
// ROTAS DE CATEGORIAS
// -------------------------------------------------------------

// 1. Listar todas as categorias (Teste 3)
router.get("/", async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    next(error); // Envia para o errorHandler do server.js
  }
});

// 2. Criar uma nova categoria (Teste 4)
router.post("/", async (req, res, next) => {
  try {
    // Valida os dados que chegaram usando o Zod
    const data = createCategorySchema.parse(req.body);
    
    // Salva no banco de dados
    const newCategory = await prisma.category.create({ data });
    
    // Retorna 201 Created com os dados
    res.status(201).json(newCategory);
  } catch (error) {
    // Se o erro for do Zod (validação), devolve 400 com a lista de problemas
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: "Dados inválidos", 
        details: error.errors 
      });
    }
    next(error);
  }
});

// 3. Atualizar categoria existente (Teste 5)
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = updateCategorySchema.parse(req.body);

    const updatedCategory = await prisma.category.update({
      where: { id },
      data,
    });

    res.json(updatedCategory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Dados inválidos", details: error.errors });
    }
    next(error);
  }
});

// 4. Excluir categoria (Teste 6)
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    // Busca a categoria para verificar o nome antes de deletar
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    // Regra: Impedir exclusão de categorias padrão do seed (ex: income, food, etc)
    const defaultCategories = ["income", "expense", "food", "transportation", "housing", "entertainment", "others"];
    
    if (defaultCategories.includes(category.name)) {
      return res.status(400).json({ error: "Categorias padrão não podem ser excluídas" });
    }

    // Se passar pela regra, deleta do banco
    await prisma.category.delete({
      where: { id },
    });

    // Retorna 204 No Content (sucesso sem corpo de resposta)
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;