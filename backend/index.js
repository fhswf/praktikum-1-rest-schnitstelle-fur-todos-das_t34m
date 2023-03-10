import express from 'express';
import Joi from 'joi';

/** Zentrales Objekt für unsere Express-Applikation */
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Liste aller ToDos. 
 * Wird später durch Datenbank ersetzt!
 */
let TODOS = [
    {
        "id": 1671056616571,
        "title": "Übung 4 machen",
        "due": "2022-11-12T00:00:00.000Z",
        "status": 0
    },
    {
        "id": 1671087245763,
        "title": "Für die Klausur Webentwicklung lernen",
        "due": "2023-01-14T00:00:00.000Z",
        "status": 2
    },
];

// Your code here
/**
 * Willkommen auf dem Server!
 * Wird hinterher angepasst.
 */
app.get('/', (req, res) => {
    res.status(200);
    res.send("Hello Todo Server!");
});

/**
 * Auslesen aller Todos
 */
app.get('/todos', (req, res) => {
    res.status(200);
    res.json(TODOS);
});

/**
 * Einzelnes Todoe auslesen
 */
app.get('/todos/:id', (req, res) => {
    const todo = TODOS.find(todo => todo.id === parseInt(req.params.id));
    if (!todo) return res.status(404).send('Ein Todo mit der angegebenen Nummer existiert nicht!');
    res.json(todo);
});

/**
 * Todoe erstellen
 */

app.post('/todos', (req, res) => {
    const { error } = validateTodo(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { title, due, status } = req.body;
    const todo = {
        id: Date.now(),
        title: title,
        due: due,
        status: status,
    };

    TODOS.push(todo);
    res.json(todo);
});

app.put('/todos/:id', (req, res) => {
    const todo = TODOS.find(todo => todo.id === parseInt(req.params.id));
    if (!todo) return res.status(404).send('Ein Todo mit der angegebenen Nummer existiert nicht!');

    const { error } = validateTodo(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const { title, due, status } = req.body;

    todo.title = title;
    todo.due = due;
    todo.status = status;

    res.send(todo);
});

app.delete('/todos/:id', (req, res) => {
    const todo = TODOS.find(todo => todo.id === parseInt(req.params.id));
    if (!todo) return res.status(404).send('Ein Todo mit der angegebenen Nummer existiert nicht!');

    const index = TODOS.indexOf(todo);
    console.log(index);
    TODOS.splice(index, 1);

    res.send(todo);
});

function validateTodo(todo) {
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        due: Joi.date().required(),
        status: Joi.number().min(0).max(2).required()
    });

    return schema.validate(todo);
};

/**
 * Server starten
 */
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});