import cookieParser from 'cookie-parser';
import session from 'express-session';
import express from 'express';


import { fileURLToPath } from 'url';
import path from 'path';


const app = express();
const porta = 3000;
const host = '0.0.0.0';


var listaUsuarios = [];
var listaPet = [];

const listaDesejosAdocao = [];


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const diretorioPublico = path.join(__dirname, 'paginas');
app.use(express.static(diretorioPublico));


app.get('/login.html', (req, res) => {
    res.sendFile(path.join(diretorioPublico, 'login.html'));
});



function processaCadastroUsuario(requisicao, resposta) {
    //Extrair os dados do corpo da requisição, além de validar os dados.
    const dados = requisicao.body;
  
    let conteudoResposta = ``;
    //è necessario validar os dados enviados
    //A validação dos dados e de responsabilidade da aplição servidora
  
    if (!(dados.nome && dados.email && dados.telefone)) {
        //Estão faltando dados do usuário!
        conteudoResposta = `
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Cadastro de Interessados</title>
                <link rel="stylesheet" href="cadastraUsuario.css">
            </head>
            <body>
                <div class="container">
                  <form action='/cadastrar' method='POST' class="cadastro-form">
                    <fieldset>
                        <legend class="mb-3">Cadastro de Interessados</legend>
                
                        <div class="form-group">
                            <label for="nome">Nome</label>
                            <input type="text" id="nome" name="nome" value ="${dados.nome}" required>
                        </div>
            `;
        if (!dados.nome) {
            conteudoResposta += `
                                        <div>
                                            <p class = "text-danger">Por favor, informe o nome!</p>
                                        </div>
                `;
        }
  
        conteudoResposta += `
                <div class="form-group">
                    <label for="email">E-mail</label>
                    <input type="email" id="email" name="email" value="${dados.email}"required>
                </div>  
                `;
        if (!dados.email) {
            conteudoResposta += `
                <div>
                    <p class = "text-danger">Por favor, informe o E-mail!</p>
                </div>
                `;
        }
  
        conteudoResposta += `
                 <div class="form-group">
                    <label for="telefone">Telefone</label>
                    <input type="tel" id="telefone" name="telefone" value="${dados.telefone}"required>
                </div>
               `;
  
  
        if (!dados.telefone) {
            conteudoResposta += `
            <div>
            <p class = "text-danger">Por favor, informe Um numero de telefone!</p>
            </div>`;
        }
        conteudoResposta += `
        <div class="form-group">
            <button type="submit">Cadastrar</button>
            <a href="/menu.html" class="return-button">Retornar ao Menu</a>
        </div>
    </fieldset>
  </form>
  </div>  
  </body>
  
  </html>`;
        resposta.end(conteudoResposta);
  
  
    }
    else {
  
        const usuario = {
            nome: dados.nome,
            email: dados.email,
            telefone: dados.telefone,
  
        }
        //Indica um  novo usuário na lista de usuários ja cadastrado
        listaUsuarios.push(usuario);
        //retornar a lista de usuário
        conteudoResposta = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cadastro de Interessados</title>
        <link rel="stylesheet" href="cadastraUsuario.css">
        </head>
    <body>
        <h1>Lista de usuários cadastrados</h1>
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Telefone</th>
  
                </tr>
            </thead>
            <tbody>`;
  
        for (const usuario of listaUsuarios) {
            conteudoResposta += `
                    <tr>
                        <td>${usuario.nome}</td>
                        <td>${usuario.email}</td>
                        <td>${usuario.telefone}</td>
  
                    </tr>
                
                
                `;
        }
        conteudoResposta += `
                </tbody>
            </table>
            <a href="/" role="button">Voltar ao Menu...</a>
            <a href="/cadastraUsuario.html" role="button">Continuar cadastrando</a>
        </body>
     </html>`;
  
        resposta.end(conteudoResposta);
    } // fim do if/else... dos Usuários
}

function processaCadastroPet(requisicao, resposta) {
    //Extrair os dados do corpo da requisição, além de validar os dados.
    const dados = requisicao.body;
  
    let conteudoResposta = ``;
    //è necessario validar os dados enviados
    //A validação dos dados e de responsabilidade da aplição servidora
  
    if (!(dados.nome_pet && dados.raca_pet && dados.idade_pet)) {
        //Estão faltando dados dos Pet´s!
        conteudoResposta = `
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Cadastro de Pets</title>
                <link rel="stylesheet" href="cadastraPet.css">
            </head>
            <body>
                <div class="container">
                    <form action='/cadastrar_pet' method='POST' class="cadastro-form">
                        <fieldset>
                            <legend class="mb-3">Cadastro de Pets</legend>
                
                            <div class="form-group">
                                <label for="nome_pet">Nome do Pet</label>
                                <input type="text" id="nome_pet" name="nome_pet" value ="${dados.nome_pet}" required>
                            </div>
            `;
        if (!dados.nome_pet) {
            conteudoResposta += `
                                        <div>
                                            <p class = "text-danger">Por favor, informe o nome do pet!</p>
                                        </div>
                `;
        }
  
        conteudoResposta += `
                <div class="form-group">
                    <label for="raca_pet">Raça</label>
                    <input type="text" id="raca_pet" name="raca_pet" value="${dados.raca_pet}" required>
                </div> 
                `;
        if (!dados.raca_pet) {
            conteudoResposta += `
                <div>
                    <p class = "text-danger">Por favor, informe a Raça do Pet!</p>
                </div>
                `;
        }
  
        conteudoResposta += `
                <div class="form-group">
                    <label for="idade_pet">Idade (anos)</label>
                    <input type="number" id="idade_pet" name="idade_pet" value="${dados.idade_pet}" required>
                </div>
               `;
  
  
        if (!dados.idade_pet) {
            conteudoResposta += `
            <div>
                <p class = "text-danger">Por favor, informe a idade do Pet!</p>
            </div>`;
        }
        conteudoResposta += `
        <div class="form-group">
            <button type="submit">Cadastrar Pet</button>
            <a href="/menu.html" class="return-button">Retornar ao Menu</a>
        </div>
    </fieldset>
  </form>
  </div>  
  </body>
  
  </html>`;
        resposta.end(conteudoResposta);
  
  
    }
    else {
  
        const pet = {
            nome_pet: dados.nome_pet,
            raca_pet: dados.raca_pet,
            idade_pet: dados.idade_pet
  
        }
        //Indica um  novo Pet na lista de Pet´s ja cadastrado
        listaPet.push(pet);
        //retornar a lista de usuário
        conteudoResposta = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cadastro de Pets</title>
        <link rel="stylesheet" href="cadastraPet.css">
    </head>
        <h1>Lista de Pets cadastrados</h1>
        <table class="form-group">
            <thead>
                <tr>
                    <th>Nome do Pet</th>
                    <th>Raça do Pet</th>
                    <th>Idade do Pet</th>
  
                </tr>
            </thead>
            <tbody>`;
  
        for (const pet of listaPet) {
            conteudoResposta += `
                    <tr>
                        <td>${pet.nome_pet}</td>
                        <td>${pet.raca_pet}</td>
                        <td>${pet.idade_pet}</td>
  
                    </tr>
                
                
                `;
        }
        conteudoResposta += `
                </tbody>
            </table>
            <a href="/" role="button">Voltar ao Menu...</a>
            <a href="/cadastraPet.html" role="button">Continuar cadastrando pet</a>
        </body>
     </html>`;
  
        resposta.end(conteudoResposta);
    } // fim do if/else.. Dos Pet´s
}

app.use(cookieParser());

app.use(session({
  secret: "M1nH4Ch4v3S3cR3t4",
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 30 // 30 minutos
  }
}));

app.use(express.urlencoded({ extended: true }));

app.get( '/', autenticar, (requisicao, resposta) => {


    const dataUltimoAcesso = requisicao.cookies.DataUltimoAcesso;
    const data  = new Date ();
    resposta.cookie("DataUltimoAcesso", data.toLocaleString(), {
        maxAge : 1000 * 60 * 60 * 24 * 30,
        httpOnly : true
    });
    resposta.end(`
    <!DOCTYPE html>
  <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Menu do Sistema</title>
        <link rel="stylesheet" href="menu.css">
   </head>
   <body>
            <header>
                 <h1>MENU</h1>
            </header>
            <nav>
                <ul>
                    <li><a href="/cadastraUsuario.html">Cadastrar Usuário</a></li>
                    <li><a href="/cadastraPet.html">Cadastrar Pet</a></li>
                    <li><a href="/adotarPet.html">Adotar um Pet</a></li>
                </ul>
 
                <div id="logoutButtonContainer">
                    <button id="logoutButton">Logout</button>
                </div>
            </nav>
     
  
            <footer>
                <p> Seu último acesso foi em ${dataUltimoAcesso}</p>
            </footer>
    </body>
  </html>
    `)
}); // Exibição do menu...

// Rota de login
app.post('/login', (requisicao, resposta) => {
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
  
    console.log('Usuário:', usuario);
    console.log('Senha:', senha);
  
    if (usuario === 'tiago' && senha === '123') {
      requisicao.session.usuarioAutenticado = true;
      resposta.redirect('/');
    } else {
      resposta.end(`
        <!DOCTYPE html>
        <head>
            <meta charset="UTF-8">
            <title>Falha na autenticação</title>
            <link rel="stylesheet" type="text/css" href="errologin.css">
        </head>
        <body>
            <h1>Usuário ou senha inválido!</h1>
            <a href="/login.html">Voltar ao login</a>
        </body>
     </html>
      `);
    }
});


function autenticar(requisicao, resposta, next) {
    if (requisicao.session && requisicao.session.usuarioAutenticado) {
        // Se o usuário estiver autenticado na sessão, permita o acesso à rota
        next();
    } else {
        // Se não estiver autenticado, redirecione para a página de login
        resposta.redirect('/login.html'); // Redirecionar para a página de login
    }
}

// logout o front end esta no arquivo menu.html tipo incorporado
app.post('/logout', (req, res) => {
    // Remova a propriedade 'usuarioAutenticado' da sessão para desconectar o usuário
    req.session.usuarioAutenticado = false;
    res.sendStatus(200); // Envie um status de OK para indicar sucesso no logout
});



// Rota para adicionar um novo desejo de adoção
app.post('/adicionar_desejo', (req, res) => {
    const dadosFormulario = req.body;

    const dataAtual = new Date().toLocaleDateString(); // Obtém a data atual no formato desejado

    const novoDesejo = {
        interessado: dadosFormulario.interessado,
        pet: dadosFormulario.pet,
        data: dataAtual
    };

    listaDesejosAdocao.push(novoDesejo); // Adiciona o novo desejo à lista de desejos de adoção

    res.redirect('/adotarPet.html'); // Redireciona para a página de adoção ou outra página desejada
});


// Rota para fornecer a lista de interessados
app.get('/listaInteressados', autenticar, (requisicao, resposta) => {
    // Retorne a lista de interessados como um array JSON
    resposta.json(listaUsuarios);
});

// Rota para fornecer a lista de pets
app.get('/listaPets', autenticar, (requisicao, resposta) => {
    // Retorne a lista de pets como um array JSOn
    resposta.json(listaPet);
});

app.get('/listaDesejosAdocao', (req, res) => {
    res.json(listaDesejosAdocao);
});
  




app.post( '/cadastrar', autenticar, processaCadastroUsuario);
app.post( '/cadastrarPet', autenticar, processaCadastroPet);


app.listen(porta, host, () => {
    console.log(`Servidor executando na url http://${host}:${porta}`);
});
