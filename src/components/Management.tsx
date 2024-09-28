"use client";

import { apiClientside } from "@/lib/trpc/trpcClientside";
import LoadingBars from "./LoadingBars";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export const Management = () => {
    const { data, error, status } =
        apiClientside.db.getAllUsersWithPurchasedCourses.useQuery();

    type DataType = NonNullable<typeof data>;

    if (status === "loading") {
        return <LoadingBars />;
    }
    if (status === "error") {
        return <div>Error: {error.message}</div>;
    }

    if (status === "success" && data && data.length > 0) {
        const transformedData = transformUsersData(data);
        const columns: GridColDef<(typeof transformedData)[number]>[] = [
            { field: "id", headerName: "ID", width: 50 },
            {
                field: "name",
                headerName: "Name",
                width: 100,
                editable: true,
            },
            {
                field: "customerId",
                headerName: "Customer ID",
                width: 100,
                editable: true,
            },
            {
                field: "email",
                headerName: "Email",
                width: 200,
                editable: true,
            },
            {
                field: "productsPurchased",
                headerName: "Products",
                description:
                    "This column has a custom cell renderer to display products.",
                sortable: false,
                width: 300,
                renderCell: (params) => (
                    <div>
                        {params.value.map((product: any, index: number) => (
                            <div key={index}>
                                <strong>Price ID:</strong> {product.priceId},{" "}
                                <strong>Timestamp:</strong> {product.timestamp}
                            </div>
                        ))}
                    </div>
                ),
            },
        ];
        return (
            <div className="w-full">
                <p>Showing users that have purchased products.</p>
                <DataGrid
                    rows={transformedData}
                    columns={columns}
                    checkboxSelection
                />
            </div>
        );
    }

    return <div>No users with purchase currently</div>;

    function transformUsersData(usersData: DataType) {
        const transformedUsersData = usersData.map((user) => {
            const purchasedProducts = [];
            for (const product of user.productsPurchased) {
                const priceId = product.split(":")[0];
                const timestamp = product.split(":")[1];
                const productData = {
                    priceId,
                    timestamp,
                };
                purchasedProducts.push(productData);
            }
            return {
                id: user.id,
                name: user.name,
                customerId: user.stripeCustomerId,
                email: user.email,
                productsPurchased: purchasedProducts,
            };
        });

        return transformedUsersData;
    }
};

// export default function DataGridDemo() {
//   return (
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         initialState={{
//           pagination: {
//             paginationModel: {
//               pageSize: 5,
//             },
//           },
//         }}
//         pageSizeOptions={[5]}
//         checkboxSelection
//         disableRowSelectionOnClick
//       />
//   );
// }
