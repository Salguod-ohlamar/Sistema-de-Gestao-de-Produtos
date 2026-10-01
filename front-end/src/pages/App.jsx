import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "./App.css";


function App() {
  // Estado para controlar se o modal está aberto (true) ou fechado (false)
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="app-container">
        {/* Passamos a função de abrir o modal para dentro do Header */}
        <Header onOpenLogin={() => setIsModalOpen(true)} />

        <main className="content-container">
          <h2>Crie algo legal aqui</h2>
          <p>
            
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eveniet veritatis vero voluptatibus 
            cupiditate quae, est id porro ipsum at! Fuga debitis necessitatibus voluptate odio aliquam 
            voluptates ut sint ipsa sunt.
          </p>
        </main>

        <Footer />
      </div>

      {/* ESTRUTURA DO MODAL ELEGANTE */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          {/* o stopPropagation evita que o modal feche ao clicar dentro do formulário */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            
            <h3>Acesse sua Conta</h3>
            <p className="modal-subtitle">Insira suas credenciais para entrar.</p>
            
            <form className="modal-form">
              <div className="input-group">
                <label>E-mail</label>
                <input type="email" placeholder="seu@email.com" required />
              </div>
              <div className="input-group">
                <label>Senha</label>
                <input type="password" placeholder="••••••••" required />
              </div>
              <button type="submit" className="btn-submit">Entrar</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
