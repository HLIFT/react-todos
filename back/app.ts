import { PrismaClient, todos as PrismaTodo } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import express, { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import cors from 'cors';

// eslint-disable-next-line import/extensions
import { ApiTodoResponseData, CreatePayload, UpdatePayload } from './commonTypes';

const app = express();

const port = process.env.PORT || 4000;

const prisma = new PrismaClient();

async function getAllTodos() {
  const todos = await prisma.todos.findMany();
  console.dir(todos, { depth: null });
  return todos;
}

async function createTodo(body: CreatePayload) {
  const todo = await prisma.todos.create({
    data: {
      title: body.title,
      description: body.description,
      label_id: body.label_id ? body.label_id : null,
      due_date: body.due_date ? body.due_date : null,
    },
  });
  console.dir(todo, { depth: null });
  return todo;
}

async function updateTodo(id: PrismaTodo['id'], body: UpdatePayload) {
  const todo = await prisma.todos.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      label_id: body.label_id ? body.label_id : null,
      due_date: body.due_date ? body.due_date : null,
      completed: body.completed,
    },
  });
  console.dir(todo, { depth: null });
  return todo;
}

async function deleteTodo(id: PrismaTodo['id']) {
  await prisma.todos.delete({
    where: { id },
  });
}

async function getAllLabels() {
  const labels = await prisma.labels.findMany();
  console.dir(labels, { depth: null });
  return labels;
}

const dataMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { body } = req;

  if (!body) {
    return res.status(422).json({ success: false, message: 'Le body est obligatoire' });
  } if (!body.title) {
    return res.status(422).json({ success: false, message: 'Le titre est obligatoire' });
  }

  return next();
};

app.use(cors());

app.use(express.json());

app.get('/api/todos', async (req: Request, res: Response) => {
  const todos = await getAllTodos()
    .catch((e) => {
      throw e;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  const result = {
    success: true,
    todos,
  };

  res.status(200).json(result);
});

app.post('/api/todos', dataMiddleware, async (req: Request, res: Response) => {
  const todo = await createTodo(req.body)
    .catch((e) => {
      throw e;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  const result = {
    success: true,
    todo,
  };

  res.status(201).json(result);
});

app.put('/api/todos/:id', dataMiddleware, async (req: Request, res: Response) => {
  const todo = await updateTodo(parseInt(req.params.id, 10), req.body)
    .catch((e) => {
      let result = {
        success: false,
        message: 'Erreur.',
      };
      if (e.code === 'P2025') {
        result = {
          success: false,
          message: 'Cette todo est introuvable.',
        };
      }

      return res.status(422).json(result);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  const result: ApiTodoResponseData = {
    success: true,
    todo,
  };

  res.status(200).json(result);
});

app.delete('/api/todos/:id', async (req: Request, res: Response) => {
  await deleteTodo(parseInt(req.params.id, 10))
    .catch((e) => {
      let result = {
        success: false,
        message: 'Erreur.',
      };
      if (e.code === 'P2025') {
        result = {
          success: false,
          message: 'Cette todo est introuvable.',
        };
      }

      res.status(422).json(result);
    })
    .finally(async () => {
      const result = {
        success: true,
      };

      res.status(200).json(result);

      await prisma.$disconnect();
    });
});

app.get('/api/labels', async (req: Request, res: Response) => {
  const labels = await getAllLabels()
    .catch((e) => {
      throw e;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  const result = {
    success: true,
    labels,
  };

  res.status(200).json(result);
});

app.get('*', (req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.listen(port, () => console.log(`Server started : http://localhost:${port}`));
