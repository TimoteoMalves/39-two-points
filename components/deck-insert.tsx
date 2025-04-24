"use client";

import { Card, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";
import { LuPlus } from "react-icons/lu";

export function DeckInsert() {
  return (
    <Link href="/deck/new">
      <Card className="p-3 border w-full h-full border-dashed cursor-pointer border-primary hover:scale-105 shadow-none">
        <CardBody className="flex items-center justify-center text-4xl text-primary">
          <LuPlus />
        </CardBody>
      </Card>
    </Link>
  );
}
