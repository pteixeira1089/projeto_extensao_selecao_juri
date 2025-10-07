export class Urna {

    create(){
        const container = document.createElement('div');
        container.classList.add('list-group', 'urna-container');
        container.id = 'urna-container';

        return container
    }
}