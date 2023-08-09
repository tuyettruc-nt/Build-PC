import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
// import "./newComponent.css";
import { AiOutlineEdit } from "@react-icons/all-files/ai/AiOutlineEdit";
import { AiOutlineDelete } from "@react-icons/all-files/ai/AiOutlineDelete";
import { toast } from "react-toastify";
import axios from "axios";
const Components = () => {
  const URL = "https://fpc-shop.azurewebsites.net/api/Component";
  const token = localStorage.getItem("tokenUser");
  const [data, setData] = useState([]);
  const [nameBrands, setNameBrands] = useState({});
  const [nameCate, setNameCates] = useState({});

  useEffect(() => {
    getAllComponents();
    getAllBrands();
    getAllCategories();
  }, []);

  const getAllBrands = async () => {
    try {
      const response = await axios.get(
        "https://fpc-shop.azurewebsites.net/api/Brand",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const nameBrandsMap = {};
      response.data.data.forEach((brand) => {
        nameBrandsMap[brand.id] = brand.name;
      });
      setNameBrands(nameBrandsMap);
    } catch (error) {
      console.log(error.message);
    }
  };
  const getAllCategories = async () => {
    try {
      const response = await axios.get(
        "https://fpc-shop.azurewebsites.net/api/Category",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const nameCateMap = {};
      response.data.data.forEach((cate) => {
        nameCateMap[cate.id] = cate.name;
      });
      setNameCates(nameCateMap);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAllComponents = async () => {
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
    if (window.confirm("Are you sure you want to delete this component?")) {
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
          getAllComponents();
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
      width: 200,
      editable: true,
    },
    { field: "image", headerName: "Image", width: 250, editable: true },
    { field: "price", headerName: "Price", width: 100, editable: true },

    {
      field: "description",
      headerName: "Description",
      width: 250,
      editable: true,
    },
    {
      field: "brandId",
      headerName: "Brand Name",
      width: 90,
      editable: true,
      valueGetter: (params) => nameBrands[params.row.brandId] || "Unknown PC",
    },
    {
      field: "categoryId",
      headerName: "Category Name",
      width: 90,
      editable: true,
      valueGetter: (params) => nameCate[params.row.categoryId] || "Unknown PC",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        const { id } = params.row;

        return (
          <>
            <Link to={`/editComponent/${id}`}>
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
      <h1 className="title">Components List</h1>
      <div className="Createbtn">
        <Link to="/addComponent/">
          <button className="btn-create">Create Component</button>
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

export default Components;
