"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { LuPen, LuTrash } from "react-icons/lu";

export function Deck() {
  return (
    <Card className="p-3 hover:scale-105 border" shadow="none">
      <CardHeader className="flex flex-col items-start">
        <h1 className="text-xl font-bold">English</h1>
        <p className="text-base">My english deck</p>
      </CardHeader>
      <Divider />
      <CardBody className="text-sm flex flex-col gap-1">
        <p>Total: 0</p>
        <p>Revisar: 0</p>
        <span className="font-bold">Criado em 22/05/2025</span>
      </CardBody>
      <CardFooter className="flex justify-end gap-1">
        <Button isIconOnly color="danger" size="sm" variant="flat">
          <LuTrash />
        </Button>
        <Button isIconOnly color="success" size="sm" variant="flat">
          <LuPen />
        </Button>
        <Button color="primary" size="sm" variant="flat">
          Revisar +25
        </Button>
      </CardFooter>
    </Card>
  );
}
