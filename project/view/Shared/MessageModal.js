/**
 * A reusable message modal component.
 */
export class MessageModal {
    /**
     * @param {object} props
     * @param {string} props.title - The title of the modal.
     * @param {string} props.message - The message to display.
     * @param {function} props.onOk - Callback function to execute when the ok button is clicked.
     */
    constructor({ title, message, onOk = null }) {
        this.title = title;
        this.message = message;
        this.onOk = onOk;
        this.element = null;

        // Bind context for event handlers
        this._handleOk = this._handleOk.bind(this);
    }

    _handleOk() {
        if (this.onOk) {
            this.onOk();
        }
        this.hide();
    }

    create() {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';

        const modalDialog = document.createElement('div');
        modalDialog.className = 'modal-dialog';
        modalDialog.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${this.title}</h5>
                </div>
                <div class="modal-body">
                    <p>${this.message}</p>
                </div>
                <div class="modal-footer d-flex justify-content-center align-items-center">
                    <button type="button" class="btn btn-primary btn-confirm">Ok</button>
                </div>
            </div>
        `;

        modalOverlay.appendChild(modalDialog);
        this.element = modalOverlay;

        // Add event listeners
        this.element.querySelector('.btn-confirm').addEventListener('click', this._handleOk);
        return this.element;
    }

    show() {
        if (!this.element) {
            this.create();
        }
        document.body.appendChild(this.element);
    }

    hide() {
        if (this.element && this.element.parentNode) {
            this.element.remove();
        }
        this.element = null;
    }
}