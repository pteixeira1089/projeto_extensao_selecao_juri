import { ModalTypes } from '../model/enums/ModalTypes.js';
import { ConfirmationModal } from '../view/Shared/ConfirmationModal.js';
import { MessageModal } from '../view/Shared/MessageModal.js';

/**
 * A service to programmatically display modals.
 * This decouples controllers from the view implementation.
 */
export class ModalService {
    /**
     * Displays a confirmation dialog and returns a Promise that resolves with `true` if confirmed, or `false` if canceled.
     * @param {object} options
     * @param {string} options.title - The title for the modal.
     * @param {string} options.message - The message to display in the modal.
     * @returns {Promise<boolean>}
     */
    static confirm({ title, message, onConfirm, onCancel, confirmButtonText = 'Confirmar', cancelButtonText = 'Cancelar', modalType = ModalTypes.CONFIRM_ONLY }) {
        return new Promise((resolve) => {
            // Define os callbacks padrão aqui dentro, onde 'resolve' está no escopo.
            const handleConfirm = onConfirm ? () => { onConfirm(); resolve(true); } : () => resolve(true);
            const handleCancel = onCancel ? () => { onCancel(); resolve(false); } : () => resolve(false);

            const modal = new ConfirmationModal({
                title,
                message,
                onConfirm: handleConfirm,
                onCancel: handleCancel,
                confirmButtonText: confirmButtonText,
                cancelButtonText: cancelButtonText,
                modalType: modalType
            });
            modal.show();
        });
    }

    /**
     * Displays a confirmation dialog with an input field.
     * @param {object} options
     * @param {string} options.title - The title for the modal.
     * @param {string} options.message - The message to display above the input.
     * @param {string} [options.confirmButtonText='Confirmar'] - Text for the confirm button.
     * @param {string} [options.cancelButtonText='Cancelar'] - Text for the cancel button.
     * @returns {Promise<string|false>} A Promise that resolves with the input's string value if confirmed, or `false` if canceled.
     */
    static confirmWithInput({ title, message, confirmButtonText = 'Confirmar', cancelButtonText = 'Cancelar' }) {
        return new Promise((resolve) => {
            const modal = new ConfirmationModal({
                title,
                message,
                confirmButtonText,
                cancelButtonText,
                modalType: ModalTypes.CONFIRM_WITH_INPUT, // 1. Especifica o tipo de modal
                onConfirm: (inputValue) => resolve(inputValue), // 2. Resolve a Promise com o valor do input
                onCancel: () => resolve(false), // 3. Resolve com 'false' no cancelamento
            });
            modal.show();
        });
    }

    static message({ title, message }) {
        return new Promise((resolve) => {
            const modal = new MessageModal({
                title: title,
                message: message,
                onOk: () => resolve(true)
            });
            modal.show();
        });

    }
}
