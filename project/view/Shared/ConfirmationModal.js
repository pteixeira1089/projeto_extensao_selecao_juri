/**
 * A reusable confirmation modal component.
 */
export class ConfirmationModal {
    /**
     * @param {object} props
     * @param {string} props.title - The title of the modal.
     * @param {string} props.message - The confirmation message to display.
     * @param {string} props.confirmButtonText - Text of 'confirm button' - defalut value is 'Confirmar'
     * @param {string} props.cancelButtonText - Text of 'cancel button' - defalut value is 'Cancelar'
     * @param {function} props.onConfirm - Callback function to execute when the confirm button is clicked.
     * @param {function} props.onCancel - Callback function to execute when the cancel button is clicked.
     */
    constructor({ title, message, onConfirm, onCancel, confirmButtonText = 'Confirmar', cancelButtonText = 'Cancelar' }) {
        this.title = title;
        this.message = message;
        this.confirmButtonText = confirmButtonText;
        this.cancelButtonText = cancelButtonText;
        this.onConfirm = onConfirm;
        this.onCancel = onCancel;
        this.element = null;

        // Bind context for event handlers
        this._handleConfirm = this._handleConfirm.bind(this);
        this._handleCancel = this._handleCancel.bind(this);
    }

    _handleConfirm() {
        if (this.onConfirm) {
            this.onConfirm();
        }
        this.hide();
    }

    _handleCancel() {
        if (this.onCancel) {
            this.onCancel();
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
                    <button type="button" class="btn btn-secondary btn-cancel">${this.cancelButtonText}</button>
                    <button type="button" class="btn btn-primary btn-confirm">${this.confirmButtonText}</button>
                </div>
            </div>
        `;

        modalOverlay.appendChild(modalDialog);
        this.element = modalOverlay;

        // Add event listeners
        this.element.querySelector('.btn-confirm').addEventListener('click', this._handleConfirm);
        this.element.querySelector('.btn-cancel').addEventListener('click', this._handleCancel);

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