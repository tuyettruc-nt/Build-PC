import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "@react-icons/all-files/ai/AiOutlineEdit";
import { AiOutlineDelete } from "@react-icons/all-files/ai/AiOutlineDelete";
import { toast } from "react-toastify";
import axios from "axios";
const OrderTable = () => {
  const URL = "https://fpc-shop.azurewebsites.net/api/Brand";
  const token = localStorage.getItem("tokenUser");
  const [data, setData] = useState([]);
  useEffect(() => {
    getAllBrands();
  }, []);

  const getAllBrands = async () => {
    await axios
      .get(`${URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        setData(response.data.data);
      })
      .catch(function (error) {
        console.log(error.message);
      });
  };
  const handleEditCellChange = (params) => {
    const { id, field, value } = params;
    data?.map((item) => (item.id === id ? { ...item, [field]: value } : item));
  };
  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      await axios
        .delete(
          `${URL}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          id
        )
        .then(function (response) {
          getAllBrands();
          toast.success("Deleted Successfully ~");
        })
        .catch(function (error) {
          toast.error("Delete: Error!");
          console.log(error.message);
        });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50, editable: false },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      editable: true,
    },
    { field: "logo", headerName: "Logo", width: 400, editable: true },
    { field: "origin", headerName: "Origin", width: 300, editable: true },

    {
      field: "status",
      headerName: "Status",
      width: 100,
      type: Boolean,
      editable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        const { id } = params.row;

        return (
          <>
            <Link to={`/editBrand/${id}`}>
              <button>
                <AiOutlineEdit /> Edit
              </button>
            </Link>
            <button onClick={() => handleDeleteClick(id)}>
              <AiOutlineDelete /> Delete
            </button>
          </>
        );
      },
    },
  ];

  return (
    <div className="layout">
      <h1 className="title">Brands List</h1>
      <div className="Createbtn">
        <Link to="/addBrand/">
          <button className="btn-create">Create Brand</button>
        </Link>
      </div>
      <Box sx={{ height: "60%", width: "100%", marginTop: "30px" }}>
        <div
          className="dashboard-content"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></div>
        <DataGrid
          rows={data}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[6]}
          checkboxSelection
          disableRowSelectionOnClick
          editMode="cell"
          onEditCellChange={handleEditCellChange}
        />
      </Box>
    </div>
  );
};

export default OrderTable;
