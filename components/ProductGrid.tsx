"use client";
import React, { useEffect, useState } from "react";
import HomeTabbar from "./HomeTabbar";
import { productType } from "@/constants";
import { client } from "@/sanity/lib/client";
import { motion, AnimatePresence } from "motion/react";
import NoProductsAvailable from "./NoProductsAvailable";
import { Loader2 } from "lucide-react";
import { Product } from "@/sanity.types";
import ProductCard from "./ProductCard";

const ProductGrid = () => {
  const [selectedTab, setSelectedTab] = useState(productType[0]?.title || "");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Query and params are dependent on the selected tab.
  const query = `*[_type == 'product' && variant == $variant] | order(name asc)`;
  const params = { variant: selectedTab.toLowerCase() };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query, params);
        setProducts(response);
      } catch (error) {
        console.log("Product fetching Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTab]); // Added 'query' and 'params' as dependencies

  return (
    <div className="mt-10 flex flex-col items-center px-4 sm:px-6 md:px-8">
      {/* Tab Bar */}
      <HomeTabbar selectedTab={selectedTab} onTabSelect={setSelectedTab} />

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="animate-spin" />
            <span className="text-lg font-semibold">Product is loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* No Products or Product Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-10 w-full">
              {products.map((product: Product) => (
                <AnimatePresence key={product?._id}>
                  <motion.div
                    layout
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center" // Ensure cards are centered in their grid cell
                  >
                    <ProductCard product={product} />
                  </motion.div>
                </AnimatePresence>
              ))}
            </div>
          ) : (
            <NoProductsAvailable selectedTab={selectedTab} />
          )}
        </>
      )}
    </div>
  );
};

export default ProductGrid;
