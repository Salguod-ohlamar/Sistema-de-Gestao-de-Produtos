import style from './Header.module.css';

// Recebemos a função onOpenLogin como propriedade (prop)
function Header({ onOpenLogin }) {
    return (
        <header className={style['main-header']}>
            <div className={style['header-container']}>
                <a href="#" className={style.logo}>Meu<span>Logo</span></a>

                <nav className={style['nav-menu']}>
                    <ul>
                        <li><a href="#">Início</a></li>
                        <li><a href="#">Sobre</a></li>
                        <li><a href="#">Serviços</a></li>
                        <li><a href="#">Contato</a></li>
                    </ul>
                </nav>

                <div className={style['header-cta']}>
                    {/* Mudamos para um botão comum com o evento onClick */}
                    <button onClick={onOpenLogin} className={style['btn-elegant']}>
                        Começar
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
