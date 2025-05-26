"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState, useRef, useEffect } from "react";
import { LayoutDashboardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboardIcon /> },
];

export default function StackedMenu() {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex];
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement;
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [hoveredIndex]);

  useEffect(() => {
    requestAnimationFrame(() => {
      const overviewElement = tabRefs.current[0];
      if (overviewElement) {
        const { offsetLeft, offsetWidth } = overviewElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    });
  }, []);

  return (
    <div
      className={`justify-start items-center dark:bg-[#0e0f11] hidden md:flex`}
    >
      <Card
        className={`w-full  border-none shadow-none relative flex items-center justify-center`}
      >
        <CardContent className="p-0">
          <div className="relative">
            {/* Hover Highlight */}
            <div
              className="absolute transition-all duration-300 ease-out bg-[#0e0f1114] dark:bg-[#ffffff1a] rounded-[6px] flex items-center"
              style={{
                ...hoverStyle,
                opacity: hoveredIndex !== null ? 1 : 0,
              }}
            />

            {/* Active Indicator */}
            <div
              className="absolute bottom-[-6px]  bg-[#0e0f11] dark:bg-white transition-all duration-300 ease-out"
              style={activeStyle}
            />

            {/* Tabs */}
            <div className="relative flex space-x-[6px] items-center">
              {tabs.map((tab, index) => (
                <Link key={index} href={tab.href} passHref>
                  <Button
                    className={`px-3 py-2 cursor-pointer transition-colors duration-300 rounded-t-md rounded-b-none shadow-sm ${
                      tab.href.split("/")[1] === pathname.split("/")[1]
                        ? "bg-[#0e0e10] dark:bg-[#ffffff1a] text-white border-b-2 border-[#0e0f11] dark:border-white"
                        : "bg-transparent text-[#0e0f1199] dark:text-[#ffffff99]"
                    }`}
                    variant="ghost"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="text-sm font-[var(--www-mattmannucci-me-geist-regular-font-family)] leading-5 whitespace-nowrap flex items-center justify-center h-full space-x-2">
                      <p>{tab.label}</p>
                      <div>{tab.icon}</div>
                    </div>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
