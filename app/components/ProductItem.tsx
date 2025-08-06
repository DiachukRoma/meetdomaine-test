import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl, getSecondaryImageForVariant} from '~/lib/variants';
import {useState} from 'react';

export function ProductItem({product}: {product: any}) {
  const variantUrl = useVariantUrl(product.handle);

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.nodes?.[0],
  );

  return (
    <Link
      className="product-item block group !no-underline"
      to={variantUrl}
      prefetch="intent"
    >
      {(() => {
        const isVariantAvailable = selectedVariant?.image;
        const mainImage = isVariantAvailable
          ? selectedVariant.image
          : product.featuredImage;
        const secondaryImage = isVariantAvailable
          ? getSecondaryImageForVariant(selectedVariant, product.images)
          : null;

        return (
          <div className="relative aspect-square overflow-hidden group/image block group border mm-border-gray">
            {selectedVariant?.compareAtPrice && (
              <span className="absolute z-10 top-5 left-5 border border-red-500 rounded-full py-1.5 px-3 text-base text-red-500 font-medium">
                On Sale!
              </span>
            )}

            {/* Main image */}
            <Image
              alt={mainImage?.altText || product.title}
              aspectRatio="1/1"
              data={mainImage}
              loading="lazy"
              sizes="(min-width: 45em) 600px, 100vw"
              width={600}
              height={600}
              className={`transition-opacity duration-300 ${
                secondaryImage ? 'group-hover/image:opacity-0' : ''
              }`}
            />

            {/* Secont image */}
            {secondaryImage && (
              <Image
                alt={mainImage?.altText || product.title}
                data={secondaryImage}
                loading="lazy"
                sizes="(min-width: 45em) 600px, 100vw"
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/image:opacity-100"
              />
            )}
          </div>
        );
      })()}

      {/* Variants */}
      {product.variants?.nodes?.length > 1 && (
        <div className="mt-4 mb-3 flex gap-2">
          {product.variants.nodes.map((variant: any) => {
            const colorOption = variant.selectedOptions?.find(
              (opt: any) => opt.name === 'Color',
            );

            return (
              <button
                key={variant.id}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedVariant(variant);
                }}
                className={`rounded-full p-0.5 ${
                  selectedVariant.id === variant.id
                    ? 'border mm-border-blue'
                    : ''
                }`}
                title={colorOption?.value}
              >
                <div
                  className="w-5 h-5 rounded-full"
                  style={{
                    backgroundColor:
                      colorOption?.value?.toLowerCase() || 'white',
                  }}
                ></div>
              </button>
            );
          })}
        </div>
      )}

      {/* Collections */}
      {product.collections.nodes?.[0]?.title && (
        <div className="text-sm mm-font-dark">
          {product.collections.nodes[0].title}
        </div>
      )}

      {/* Name */}
      <div className="mm-font-blue font-medium my-1.5">{product.title}</div>

      {/* Prices */}
      <div className="flex gap-2">
        {selectedVariant?.compareAtPrice && (
          <span className="line-through">
            <Money
              className="text-sm mm-font-dark"
              data={selectedVariant?.price || product.priceRange.minVariantPrice}
            />
          </span>
        )}
        <Money
          className="text-sm text-red-500"
          data={selectedVariant.compareAtPrice}
        />
      </div>
    </Link>
  );
}
