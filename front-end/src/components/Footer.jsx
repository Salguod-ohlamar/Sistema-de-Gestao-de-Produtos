import style from './Footer.module.css';

function Footer() {
    return (
        <footer className={style['main-footer']}>
            <div className={style['footer-container']}>
                
                {/* Coluna 1: Logo e descrição curta */}
                <div className={style['footer-brand']}>
                    <a href="#" className={style.logo}>Meu<span>Logo</span></a>
                    <p>Criando experiências digitais modernas e sofisticadas.</p>
                </div>

                {/* Coluna 2: Links Rápidos */}
                <div className={style['footer-links']}>
                    <h4>Navegação</h4>
                    <ul>
                        <li><a href="#">Início</a></li>
                        <li><a href="#">Sobre</a></li>
                        <li><a href="#">Serviços</a></li>
                        <li><a href="#">Contato</a></li>
                    </ul>
                </div>

                {/* Coluna 3: Links Legais ou Redes Sociais */}
                <div className={style['footer-links']}>
                    <h4>Legal</h4>
                    <ul>
                        <li><a href="#">Privacidade</a></li>
                        <li><a href="#">Termos de Uso</a></li>
                    </ul>
                </div>

            </div>

            {/* Barra de Direitos Autorais inferior */}
            <div className={style['footer-bottom']}>
                <p>&copy; {new Date().getFullYear()} MeuLogo. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
}

export default Footer;
