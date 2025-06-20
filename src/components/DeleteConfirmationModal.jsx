import React from 'react';
import { removeOneProduct } from 'red-shared'
import { toast } from 'react-toastify';


export default function DeleteConfirmationModal({ onClose, productToDelete }) {

    const { mutate: remove } = removeOneProduct();

    const handleDelete = () => {
        remove(productToDelete._id)
        onClose()
        toast.success("Produto " 
            + productToDelete.product_name + " excluído com sucesso!");
        
    }


    return (
        <div>
            <p>Are you sure you want to delete <strong>{productToDelete.product_name}</strong>?</p>
            <div className="mt-4 flex justify-end space-x-2">
                <button
                    onClick={() => { onClose() }}
                    className="px-4 py-2 bg-gray-200 rounded"
                >
                    Cancelar
                </button>
                <button
                    onClick={() => { handleDelete() }
                        // setProducts((prev) =>
                        //     prev.filter((p) => p.smart_code !== productToDelete.smart_code)
                        // );
                        // setProductToDelete(null);
                    }
                    className="px-4 py-2 bg-red-500 text-white rounded"
                >
                    Confirmar
                </button>
            </div>
        </div>
    );
};

