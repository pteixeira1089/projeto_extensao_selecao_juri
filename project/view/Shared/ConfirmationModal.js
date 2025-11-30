import { ModalTypes } from "../../model/enums/ModalTypes";

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
     * @param {string} props.modalType - modal type - default is 'confirm only'
     */
    constructor({ title, message, onConfirm, onCancel, confirmButtonText = 'Confirmar', cancelButtonText = 'Cancelar', modalType = ModalTypes.CONFIRM_ONLY }) {
        this.title = title;
        this.message = message;
        this.confirmButtonText = confirmButtonText;
        this.cancelButtonText = cancelButtonText;
        this.onConfirm = onConfirm;
        this.onCancel = onCancel;
        this.element = null;
        this.inputElement = null; // Referência para o campo de input
        this.modalType = modalType;

        // Bind context for event handlers
        this._handleConfirm = this._handleConfirm.bind(this);
        this._handleCancel = this._handleCancel.bind(this);
    }

    _handleConfirm(inputValue = null) {
        let value = null;
        // Se o modal tem um input, pega o valor dele.
        if (this.modalType === ModalTypes.CONFIRM_WITH_INPUT && this.inputElement) {
            value = this.inputElement.value;
        }
        if (this.onConfirm) {
            this.onConfirm(value);
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

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        // Header
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        const modalTitle = document.createElement('h5');
        modalTitle.className = 'modal-title';
        modalTitle.textContent = this.title;
        modalHeader.appendChild(modalTitle);

        // Body
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = this.message;
        modalBody.appendChild(messageParagraph);

        // Condicionalmente adiciona o input
        if (this.modalType === ModalTypes.CONFIRM_WITH_INPUT) {
            this.inputElement = document.createElement('input');
            this.inputElement.type = 'text';
            this.inputElement.className = 'form-control mt-2'; // Estilo do Bootstrap
            this.inputElement.placeholder = 'Digite aqui...';
            modalBody.appendChild(this.inputElement);
        }

        // Footer
        const modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer d-flex justify-content-center align-items-center';

        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.className = 'btn btn-secondary btn-cancel';
        cancelButton.textContent = this.cancelButtonText;

        const confirmButton = document.createElement('button');
        confirmButton.type = 'button';
        confirmButton.className = 'btn btn-primary btn-confirm';
        confirmButton.textContent = this.confirmButtonText;

        modalFooter.append(cancelButton, confirmButton);

        // Monta o modal
        modalContent.append(modalHeader, modalBody, modalFooter);
        modalDialog.appendChild(modalContent);

        modalOverlay.appendChild(modalDialog);
        this.element = modalOverlay;

        // Add event listeners
        confirmButton.addEventListener('click', this._handleConfirm);
        cancelButton.addEventListener('click', this._handleCancel);

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
        this.inputElement = null;
    }
}