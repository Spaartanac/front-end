import  React  from 'react';
import { Nav } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { HashRouter, Link } from 'react-router-dom';

export class MainMenuItem {

    text: string = '';
    link: string = '#';

    constructor(text: string, link: string){
        this.text = text;
        this.link = link;
    }

}

interface MainMenuProperties {
    items: MainMenuItem[];
}

interface MainMenuState{
    items: MainMenuItem[];
}

export class MainMenu extends React.Component <MainMenuProperties> {
    state: MainMenuState;

    constructor(props: Readonly<MainMenuProperties>){
        super(props);

        this.state = {
            items: props.items,
        };

        /* setInterval(() =>{
            const novaLista = [ ... this.state.items ];
            novaLista.push(new MainMenuItem("Naslov", "/link"));
            this.setItems(novaLista);
        },2000); */

    }

    public setItems(items: MainMenuItem[]) {
        this.setState({
            items: items,
        });
    }


 render() {
     return (
        <Container>
     <Nav variant ="tabs">
         <HashRouter>
        { this.state.items.map(this.makeNavLink) }
        <Cart />
        </HashRouter>
            
     </Nav>
     </Container>
     );
 }

 private makeNavLink(item: MainMenuItem){
    return (
        <Link to={ item.link } className="nav-link">
        
            {item.text}
        
        </Link>
    );
 }

}