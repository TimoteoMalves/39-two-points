"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";
import { LuPlus } from "react-icons/lu";

export const animals = [
  { key: "cat", label: "Cat" },
  { key: "dog", label: "Dog" },
  { key: "elephant", label: "Elephant" },
  { key: "lion", label: "Lion" },
];

export function DeckInsert() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        <Card className="p-3 border w-full h-full border-dashed cursor-pointer border-primary hover:scale-105 shadow-none">
          <CardBody className="flex items-center justify-center text-4xl text-primary">
            <LuPlus />
          </CardBody>
        </Card>
      </button>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        size="lg"
        onClose={() => setIsOpen(false)}
      >
        <ModalContent>
          <ModalHeader>
            <span>Header</span>
          </ModalHeader>
          <ModalBody>
            <Form>
              <Input
                isRequired
                label="Nome"
                labelPlacement="outside"
                placeholder="Digite o nome para o deck..."
              />
              <Select
                isRequired
                label="Idioma"
                labelPlacement="outside"
                placeholder="Selecione um idioma"
              >
                {animals.map((animal) => (
                  <SelectItem key={animal.key}>{animal.label}</SelectItem>
                ))}
              </Select>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button size="sm" onPress={() => setIsOpen(false)}>
              Fechar
            </Button>
            <Button type="submit" color="primary" size="sm">
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
