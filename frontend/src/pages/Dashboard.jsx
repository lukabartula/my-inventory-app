import React, { useState } from "react";
import Sidebar from '../components/Sidebar';
import AddProductModal from '../components/AddProductModal';

const Dashboard = () => {

    const [showModal, setShowModal] = useState(false);

    const handleAddSuccess = () => {
        // TODO reload products from db once table exists
        console.log('Product added!');
    };

    return(

        <>

        <div className="dashboard-container">
            <Sidebar />
            
            <div className="main-content">
                <div className="dashboard-header">
                    <h1>Inventory</h1>
                    <button className="add-button" onClick={() => setShowModal(true)}>+ Add new product</button>
                </div>

                <div className="inventory-table">
                    {/*added later*/}
                    <p>Loading...</p>
                </div>
            </div>
        </div>

        <AddProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleAddSuccess}
        />

     </>
    );
};

export default Dashboard;