"use client";
import { use } from "react";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  Package,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/user-components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/user-components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsTrigger,
} from "@/components/user-components/ui/tabs";
import { TabsList } from "@radix-ui/react-tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/user-components/ui/table";
import { useProductByID } from "@/hooks/product/getProductByID";
import { useDeleteProduct } from "@/hooks/product/removeProduct";
import ConfirmDialog from "@/lib/confirmModel";
import DataLoading from "@/components/user-components/layout/LoadingPage";

export default function ProductViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: responseData, isLoading, isError } = useProductByID(id);
  const { mutate: deleteProduct } = useDeleteProduct();

  const product = responseData?.data;

  const [activeTab, setActiveTab] = useState("overview");
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  const handleRemoveClick = (id: string) => {
    setItemToRemove(id); // open modal
  };

  const confirmRemove = () => {
    if (itemToRemove) {
      deleteProduct(itemToRemove);
      setItemToRemove(null); // close modal after deletion
    }
  };

  if (!product) {
    return <DataLoading />
  }

  if (isLoading)
    return <DataLoading />
  if (isError || !responseData?.data)
    return <div className="p-12 text-center">Product Not Found</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="min-w-0">
          <h1 className="truncate text-3xl font-serif font-bold text-gray-900 whitespace-nowrap">
            {product.name}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/admin/products/${product._id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Product
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <a
              href={`/product/${product._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Eye className="h-4 w-4 mr-2" />
              View on Site
            </a>
          </Button>

          <Button
            variant="destructive"
            onClick={() => handleRemoveClick(product._id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  Rs.{product.discountedPrice.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Package className="h-4 w-4 text-blue-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {product.stock}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex justify-around">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pt-4">
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Name</p>
                    <p className="text-gray-900">{product.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Brand</p>
                    <p className="text-gray-900">{product.brand}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Category
                    </p>
                    <p className="text-gray-900">{product.categoryID?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Subcategory
                    </p>
                    <p className="text-gray-900">
                      {product.subCategoryID?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Original Price
                    </p>
                    <p className="text-gray-900">
                      Rs.{product.originalPrice.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Price after Discount
                    </p>
                    <p className="text-gray-900">
                      Rs.{product.discountedPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Description
                  </p>
                  <p className="text-gray-900 mt-1">{product.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pt-4">
                <CardTitle>Product Image</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-[400px] object-cover rounded-lg bg-gray-100"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="specifications">
          <div className="space-y-2">
            {product.technicalSpecification &&
              (Object.values(
                product.technicalSpecification.performance || {}
              ).some((v) => v) ||
                Object.values(
                  product.technicalSpecification.memoryAndStorage || {}
                ).some((v) => v)) && (
                <Card>
                  <CardHeader className="pt-4">
                    <CardTitle>Technical Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        {/* Memory & Storage Details */}
                        {product.technicalSpecification?.memoryAndStorage &&
                          Object.entries(
                            product.technicalSpecification.memoryAndStorage
                          )
                            .filter(([_, value]) => value) // only non-empty values
                            .map(([key, value]) => (
                              <TableRow key={key}>
                                <TableCell className="font-medium capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </TableCell>
                                <TableCell>{String(value)}</TableCell>
                              </TableRow>
                            ))}

                        {/* Performance Details */}
                        {product.technicalSpecification?.performance &&
                          Object.entries(
                            product.technicalSpecification.performance
                          )
                            .filter(([_, value]) => value) // only non-empty values
                            .map(([key, value]) => (
                              <TableRow key={key}>
                                <TableCell className="font-medium capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </TableCell>
                                <TableCell>{String(value)}</TableCell>
                              </TableRow>
                            ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

            {product.specifications?.some(
              (spec) => spec.key?.trim() && spec.value?.trim()
            ) && (
              <Card>
                <CardHeader className="pt-4">
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      {product.specifications
                        .filter(
                          (spec) => spec.key?.trim() && spec.value?.trim()
                        )
                        .map((spec) => (
                          <TableRow key={spec.key}>
                            <TableCell className="font-medium capitalize">
                              {spec.key.replace(/([A-Z])/g, " $1").trim()}
                            </TableCell>
                            <TableCell>{spec.value}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader className="pt-4">
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-[400px] object-cover rounded-lg bg-gray-100"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <ConfirmDialog
        open={itemToRemove !== null}
        title="Remove Product"
        message="Are you sure you want to remove this product?"
        onConfirm={confirmRemove}
        onCancel={() => setItemToRemove(null)}
      />
    </div>
  );
}
