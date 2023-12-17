import cookieParser from 'cookie-parser';
import session from 'express-session';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const porta = 3000;
const host = '0.0.0.0';


var listaUsuarios = [];

// Verifique onde você está utilizando a função fileURLToPath e se está correto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const diretorioPublico = path.join(__dirname, 'paginas');




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
                    <form action='/cadastrarUsuario' method='POST'  class="row g-3 needs-validation" novalidate>
                        <fieldset class="border p-2">
                            <legend class="mb-3">Cadastro de usúario</legend>
                
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
        if (!dados.nickname) {
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
  
  
        if (!dados.dataNascimento) {
            conteudoResposta += `
            <div>
            <p class = "text-danger">Por favor, informe Um numero de telefone!</p>
            </div>`;
        }
        conteudoResposta += `
        <div class="form-group">
            <button type="submit">Cadastrar</button>
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
    } // fim do if/else...
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

app.listen(porta, host, () => {
    console.log(`Servidor executando na url http://${host}:${porta}`);
});
