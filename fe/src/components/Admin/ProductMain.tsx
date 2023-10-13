import React, { useState, useEffect, useRef } from "react";
import { ProductType } from "../ProductCart";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useUpdateProductMutation,
} from "../../store/apiquery/productApiSlice";
import Swal from "sweetalert2";
import Spinner from "../Spinner";
import { useUploadImagesMutation } from "../../store/apiquery/productApiSlice";
import { ToastContainer, toast } from "react-toastify";

let imageIsChanged = false;

const UpdateProduct = ({ product }: { product: ProductType }) => {
  // const { data : categories } = useGetAllCategoriesQuery('api/categories')

  const [updateData, setUpdateData] = useState(product);
  const [updateProduct, udpateResult] = useUpdateProductMutation();
  const imageTag = useRef<HTMLImageElement>(null);
  const productId = product?._id;

  const [formData, setFormData] = useState({
    name: updateData.name,
    images: updateData.images,
    price: updateData.price,
    color: updateData.color,
    countInStock: updateData.countInStock,
    brand: updateData.brand,
    type: updateData.type,
    tags: updateData.tags,
  });

  const handleUpdateValue = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await updateProduct({ productId, formData });

      if ("data" in result && result.data) {
        console.log("Product Updated successfully");
        toast.success("Product Updated successfully");
        setFormData({
          name: "",
          images: [],
          price: 0,
          color: "",
          countInStock: 0,
          brand: "",
          type: "",
          tags: [],
        });
      } else if ("error" in result && result.error) {
        console.error("Product creation failed", result.error);
        toast.error("Product creation failed");
      }
    } catch (error) {
      console.error("Product creation failed`", error);
      toast.error("Product creation failed");
    }
  };

  return (
    <form
      action=""
      method="patch"
      className="checkout-service p-3"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="id" value={updateData._id} />
      <div
        className="w-25 mx-auto p-3 border border-1 rounded-5 fd-hover-border-primary"
        style={{ height: "250px" }}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-100 h-100"
          ref={imageTag}
        />
      </div>
      {/* <div className="w-25 mx-auto p-3 border border-1 rounded-5 fd-hover-border-primary" style={{ height: '250px' }}><img src={product.img} alt={product.name} className='w-100 h-100' ref={imageTag}/></div> */}
      <div className="d-flex gap-2">
        <label className="w-50">
          <span>Name</span>
          <input
            type="text"
            name="name"
            className="form-control w-100 rounded-0 p-2"
            value={formData.name}
            onChange={handleUpdateValue}
          />
        </label>
        {/* <label className="w-50">
          <span>Image</span>
          <input
            type="file"
            name="images"
            value={formData.images}
            className="form-control w-100 rounded-0 p-2"
            placeholder="Change Image"
            onChange={handleUpdateValue}
          />
        </label> */}
      </div>
      <div className="d-grid grid-4 gap-2 mt-3">
        <label>
          <span>Price</span>
          <input
            type="number"
            name="price"
            className="form-control w-100 rounded-0 p-2"
            value={formData.price}
            onChange={handleUpdateValue}
          />
        </label>
        <label>
          <span>Color</span>
          <input
            type="text"
            name="color"
            className="form-control w-100 rounded-0 p-2"
            value={formData.color}
            onChange={handleUpdateValue}
          />
        </label>
        <label>
          <span>Quantity</span>
          <input
            type="text"
            name="countInStock"
            className="form-control w-100 rounded-0 p-2"
            value={formData.countInStock}
            onChange={handleUpdateValue}
          />
        </label>
        <label>
          <span>Brand</span>
          <input
            type="text"
            name="brand"
            className="form-control w-100 rounded-0 p-2"
            value={formData.brand}
            onChange={handleUpdateValue}
          />
        </label>
      </div>
      <label>
        <span>Description</span>
        <textarea
          name="type"
          cols={100}
          rows={10}
          value={formData.type}
          className="w-100 p-2 border"
          placeholder="Description"
          onChange={handleUpdateValue}
        ></textarea>
      </label>
      <div className="my-4">
        <label>
          <span>Tags</span>
        </label>
        <textarea
          name="tags"
          cols={100}
          rows={10}
          className="w-100 p-2 border"
          placeholder="tags"
          value={formData.tags}
          onChange={handleUpdateValue}
        ></textarea>
      </div>
      <div className="mt-4">
        <ToastContainer />
      </div>
      <div className="mt-3">
        {udpateResult.isLoading ? (
          <button className="fd-btn w-25 text-center border-0">
            <span
              className="spinner-grow spinner-grow-sm"
              role="status"
              aria-hidden="true"
            ></span>
            Loading...
          </button>
        ) : (
          <button className="fd-btn w-25 text-center border-0" type="submit">
            UPDATE PRODUCT
          </button>
        )}
      </div>
    </form>
  );
};

const AddOrEditProduct = ({ product }: { product: null | ProductType }) => {
  // const [data, setData] = useState({});

  // const { data : categories } = useGetAllCategoriesQuery('api/categories')

  const [createProduct, result] = useCreateProductMutation();
  // const [uploadImages] = useUploadImagesMutation(); // Destructure the mutation function
  const [image, setImage] = useState<File | null>(null);

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setImage(e.target.files[0]);
  //   }
  // };

  // const handleImageUpload = async () => {
  //   if (image) {
  //     const formData = new FormData();
  //     formData.append("file", image);

  //     try {
  //       const result = await uploadImages(formData);
  //       if ("data" in result && result.data) {
  //         console.log("Image uploaded successfully");
  //       } else if ("error" in result && result.error) {
  //         console.error("Image upload failed", result.error);
  //       }
  //     } catch (error) {
  //       console.error("Image upload failed", error);
  //     }
  //   }
  // };

  const [file, setFile] = React.useState(null);
  const [uploadFile, { isLoading }] = useUploadImagesMutation();

  const handleFileChange = (e:any) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      uploadFile(file);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    images: [],
    price: 0,
    color: "",
    countInStock: 0,
    brand: "",
    type: "",
    tags: [],
  });

  const handleValue = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // handleUpload(); 

    try {
      const result = await createProduct({ formData });

      if ("data" in result && result.data) {
        console.log("Product created successfully");
        toast.success("Product created successfully");
        setFormData({
          name: "",
          images: [],
          price: 0,
          color: "",
          countInStock: 0,
          brand: "",
          type: "",
          tags: [],
        });
      } else if ("error" in result && result.error) {
        console.error("Product creation failed", result.error);
        toast.error("Product creation failed");
      }
    } catch (error) {
      console.error("Product creation failed`", error);
      toast.error("Product creation failed");
    }
  };

  if (!product) {
    return (
      <form
        action=""
        method="post"
        className="checkout-service p-3 .form-product"
        onSubmit={handleSubmit}
      >
        {image && (
          <div
            className="w-25 mx-auto p-3 border border-1 rounded-5 fd-hover-border-primary mb-4"
            style={{ height: "250px" }}
          >
            <img
              src={URL.createObjectURL(image)}
              alt="Product Image Preview"
              className="w-100 h-100"
            />
          </div>
        )}
        <div className="d-flex gap-2">
          <label className="w-50">
            <span>Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              className="form-control w-100 rounded-0 p-2"
              placeholder="Product Name"
              onChange={handleValue}
            />
          </label>
          {/* <label className="w-50">
            <span>Image</span>
            <input
              type="file"
              name="images"
              // value={formData.images}
              className="form-control w-100 rounded-0 p-2"
              placeholder="Product Image"
              onChange={handleFileChange}
              accept="image/*"
            />
          </label> */}
        </div>
        <div className="d-grid grid-4 gap-2 mt-3">
          <label>
            <span>Price</span>
            <input
              type="number"
              step={0.1}
              name="price"
              value={formData.price}
              className="form-control w-100 rounded-0 p-2"
              placeholder="Product Price"
              onChange={handleValue}
            />
          </label>
          <label>
            <span>Color</span>
            <input
              type="string"
              step={0.1}
              name="color"
              value={formData.color}
              className="form-control w-100 rounded-0 p-2"
              placeholder="Color"
              onChange={handleValue}
            />
          </label>
          <label>
            <span>Quantity</span>
            <input
              type="number"
              name="countInStock"
              value={formData.countInStock}
              className="form-control w-100 rounded-0 p-2"
              placeholder="Quantity"
              onChange={handleValue}
            />
          </label>
          <label>
            <span>Brand</span>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              className="form-control w-100 rounded-0 p-2"
              placeholder="Brand"
              onChange={handleValue}
            />
          </label>
          <label>
            <span>Description</span>
            <textarea
              name="type"
              cols={100}
              rows={10}
              value={formData.type}
              className="w-100 p-2 border"
              placeholder="Description"
              onChange={handleValue}
            ></textarea>
          </label>
        </div>
        <div className="my-4">
          <label>
            <span>Tags</span>
          </label>
          <textarea
            name="tags"
            cols={100}
            rows={10}
            value={formData.tags}
            className="w-100 p-2 border"
            placeholder="Tags"
            onChange={handleValue}
          ></textarea>
        </div>
        <div className="mt-3">
          <ToastContainer />
        </div>
        <div className="mt-3">
          {result.isLoading ? (
            <button className="fd-btn w-25 text-center border-0">
              <span
                className="spinner-grow spinner-grow-sm"
                role="status"
                aria-hidden="true"
              ></span>
              Loading...
            </button>
          ) : (
            <button
              className="fd-btn w-25 text-center border-0"
              // onClick={handleUpload}
            >
              SAVE NOW
            </button>
          )}
        </div>
      </form>
    );
  }

  return <UpdateProduct product={product} />;
};

const ListOfProducts = ({
  setProduct,
  setPage,
}: {
  setProduct: Function;
  setPage: Function;
}) => {
  const {
    isLoading,
    data: productsList,
    isSuccess,
    isError,
  } = useGetAllProductsQuery("api/products");
  const [deleteProduct, deletedResult] = useDeleteProductMutation();

  const parseProduct = (product: ProductType) => {
    setProduct(product);
    setPage("add");
  };

  const deleteItem = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure to delete this product ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((r) => {
      if (r.isConfirmed) {
        deleteProduct(id);
      }
    });
  };

  // search bar coding 
  const [searchInput, setSearchInput] = useState<string>('');

  let content: React.ReactNode;

  // Filter products based on the search input
    const filteredProducts = productsList?.content.filter((product: ProductType) =>{
      const productname = product.name?.toLowerCase();
      const search = searchInput.toLowerCase();
    
      // Convert numbers to strings before searching
      const price = product.price?.toString();
      const totalstock = product.countInStock?.toString();
  
      return (
        productname?.includes(search) ||
        price?.includes(search) ||
        totalstock?.includes(search)
      );
    });

  content =
    isLoading || isError
      ? null
      : isSuccess
      ? filteredProducts.map((product: ProductType) => {
          // ? sortProducts.map((product: ProductType) => {

          return (
            <tr className="p-3" key={product._id}>
              <td scope="row w-25">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  style={{ width: "50px", height: "50px" }}
                />
              </td>
              {/* <td scope="row w-25"><img src={product.img} alt={product.name} style={{ width: '50px', height: '50px' }} /></td> */}
              <td className="fw-bold">{product.name}</td>
              <td>{product.price}</td>
              <td>{product.countInStock}</td>
              <td className="fw-bold d-flex gap-2 justify-content-center">
                <a
                  href="#"
                  className="p-2 rounded-2 fd-bg-primary"
                  onClick={(e) => parseProduct(product)}
                  title="View Product"
                >
                  <i className="bi bi-eye"></i>
                </a>
                <a
                  href="#"
                  className="p-2 rounded-2 bg-secondary"
                  onClick={(e) => parseProduct(product)}
                  title="Edit"
                >
                  <i className="bi bi-pen"></i>
                </a>
                <a
                  href="#"
                  className="p-2 rounded-2 bg-danger"
                  title="Delete"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteItem(product._id);
                  }}
                >
                  <i className="bi bi-trash"></i>
                </a>
              </td>
            </tr>
          );
        })
      : null;

  return !isLoading ? (
    <div>
      {/* Add a search input field */}
      <div className="mb-3">
      <input
        type="text"
        placeholder="Search Products"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
    </div>
    <div className="table-responsive">
      <table className="table table-default text-center table-bordered">
        <thead>
          <tr className="fd-bg-primary text-white">
            <th scope="col" className="p-3">
              IMAGE
            </th>
            <th scope="col" className="p-3">
              PRODUCT NAME
            </th>
            <th scope="col" className="p-3">
              PRICE
            </th>
            <th scope="col" className="p-3">
              TOTAL STOCK
            </th>
            <th scope="col" className="p-3">
              ACTION
            </th>
          </tr>
        </thead>
        <tbody>{content}</tbody>
      </table>
    </div>
    </div>
  ) : (
    <Spinner />
  );
};

const ProductMain = () => {
  const [page, setPage] = useState("list");
  const [currentProduct, setCurrentProduct] = useState(null);

  const changeToList = () => {
    setPage("add");
    setCurrentProduct(null);
  };
  const changeToAdd = () => {
    setPage("list");
  };

  useEffect(() => setPage("list"), []);

  return (
    <div className="text-black">
      <h4 className="fw-bold">Products</h4>
      <div className="add-product my-3 d-flex justify-content-end">
        {page === "list" ? (
          <a
            href="#"
            className="fd-btn bg-secondary w-25 text-center rounded-3"
            onClick={changeToList}
          >
            ADD PRODUCT
          </a>
        ) : (
          <a
            href="#"
            className="fd-btn bg-secondary w-25 text-center rounded-3"
            onClick={changeToAdd}
          >
            PRODUCTS LIST
          </a>
        )}
      </div>
      <div className="subPartMain">
        {page === "list" ? (
          <ListOfProducts setProduct={setCurrentProduct} setPage={setPage} />
        ) : (
          <AddOrEditProduct product={currentProduct} />
        )}
      </div>
    </div>
  );
};

export default ProductMain;
