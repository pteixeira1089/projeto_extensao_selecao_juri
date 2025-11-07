import { ConfirmationModal } from '../view/Shared/ConfirmationModal.js';

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
    static confirm({ title, message }) {
        return new Promise((resolve) => {
            const modal = new ConfirmationModal({
                title,
                message,
                onConfirm: () => resolve(true),
                onCancel: () => resolve(false),
            });
            modal.show();
        });
    }
}