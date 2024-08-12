const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const sequelize = require('./models');
const Projeto = require('./models/Projeto');

app.use(express.json()); // para poder trabalhar com JSON
app.use(express.urlencoded({ extended: true })); // para trabalhar com dados de formulários

// Servindo arquivos estáticos
app.use(express.static('public'));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Sincronizando o modelo com o banco de dados
sequelize.sync()
    .then(() => {
        console.log('Banco de dados sincronizado');
    })
    .catch(err => {
        console.error('Erro ao sincronizar o banco de dados:', err);
    });

app.get('/api/projetos', async (req, res) => {
    try {
        const projetos = await Projeto.findAll();
        res.json(projetos);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar projetos' });
    }
});

app.post('/api/projetos', async (req, res) => {
    try {
        const { title, description } = req.body;
        const novoProjeto = await Projeto.create({ title, description });
        res.status(201).json(novoProjeto);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criar projeto' });
    }
});

app.put('/api/projetos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const projeto = await Projeto.findByPk(id);
        if (!projeto) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }

        projeto.title = title;
        projeto.description = description;
        await projeto.save();

        res.json(projeto);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar projeto' });
    }
});

app.delete('/api/projetos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const projeto = await Projeto.findByPk(id);
        if (!projeto) {
            return res.status(404).json({ error: 'Projeto não encontrado' });
        }

        await projeto.destroy();
        res.status(204).send(); // 204 significa "sem conteúdo"
    } catch (err) {
        res.status(500).json({ error: 'Erro ao deletar projeto' });
    }
});
