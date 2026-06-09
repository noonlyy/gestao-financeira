import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const router = Router();
const prisma = new PrismaClient();

// -------------------------------------------------------------
// SCHEMA DE VALIDAÇÃO (ZOD) - Exigido no Teste 10
// -------------------------------------------------------------
const createTransactionSchema = z.object({
  description: z.string().min(1, { message: "A descrição não pode ser vazia" }),
  value: z.number({ required_error: "O valor é obrigatório" }),
  date: z.string({ required_error: "A data é obrigatória" }),
  categoryId: z.string({ required_error: "O ID da categoria é obrigatório" }),
});

// -------------------------------------------------------------
// ROTAS DE TRANSAÇÕES
// -------------------------------------------------------------

// 1. Criar transação (Teste 7)
router.post("/", async (req, res, next) => {
  try {
    // Valida os dados com o Zod (Se a descrição vier vazia "", ele vai barrar aqui)
    const data = createTransactionSchema.parse(req.body);

    // Salva no banco de dados expandindo a categoria conectada
    const newTransaction = await prisma.transaction.create({
      data: {
        description: data.description,
        value: data.value,
        date: new Date(data.date), // Converte a string de data para o formato do banco
        categoryId: data.categoryId,
      },
      include: {
        category: true, // Isso traz a categoria aninhada/expandida na resposta
      },
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    // Tratamento de erro do Zod (Teste 10)
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: error.errors,
      });
    }
    next(error);
  }
});

// 2. Listar transações (Teste 8)
router.get("/", async (req, res, next) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        category: true, // Garante que a categoria venha expandida na lista
      },
      orderBy: {
        date: "desc", // Organiza das mais recentes para as mais antigas
      },
    });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

// 3. Excluir transação (Teste 9)
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.transaction.delete({
      where: { id },
    });

    // Retorna 204 No Content
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;