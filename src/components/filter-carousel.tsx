"use client";

import React, { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

interface FilterCarouselProps {
  value?: string | null;
  isLoading?: boolean;
  onSelect: (value: string | null) => void;
  data: {
    value: string;
    label: string;
  }[];
}

const FilterCarousel = ({
  value,
  isLoading,
  onSelect,
  data,
}: FilterCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="relative w-full">
      {/*Left fade */}
      <div
        className={cn(
          "absolute left-12 top-0 bottom-0 w-12 bg-gradient-to-r z-10 from-white to-transparent pointer-events-none",
          current === 1 && "hidden"
        )}
      />

      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          dragFree: true,
        }}
        className="w-full px-12"
      >
        <CarouselContent className="-ml-3">
          {!isLoading && (
            <CarouselItem
              onClick={() => onSelect(null)}
              className="pl-3 basis-auto"
            >
              <Badge
                variant={!value ? "default" : "secondary"}
                className="rounded-lg px-3 py-1 cursor-pointer white-space-nowrap text-sm"
              >
                All
              </Badge>
            </CarouselItem>
          )}
          {isLoading &&
            Array.from({ length: 14 }).map((_, i) => (
              <CarouselItem key={i} className="pl-3 basis-auto">
                <Skeleton className="rounded-lg px-3 py-1 h-full text-sm w-[100px] font-semibold">
                  &nbsp;
                </Skeleton>
              </CarouselItem>
            ))}
          {!isLoading &&
            data.map((item) => (
              <CarouselItem
                key={item.value}
                className="pl-3 basis-auto"
                onClick={() => onSelect(item.value)}
              >
                <Badge
                  variant={value === item.value ? "default" : "secondary"}
                  className="rounded-lg px-3 py-1 cursor-pointer white-space-nowrap text-sm"
                >
                  {item.label}
                </Badge>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselNext className="right-0 z-20" />
        <CarouselPrevious className="left-0 z-20" />
      </Carousel>
      {/*Right fade */}

      <div
        className={cn(
          "absolute right-12 top-0 bottom-0 w-12 bg-gradient-to-l z-10 from-white to-transparent pointer-events-none",
          current === count && "hidden"
        )}
      />
    </div>
  );
};

export default FilterCarousel;
