"use client";

import { useMutationCreateDeck } from "@/hooks/deck/mutations";
import { useQueryGetLanguages } from "@/hooks/language/hooks";
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
import { addToast } from "@heroui/toast";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LuPlus } from "react-icons/lu";

export function DeckInsert() {
  const form = useForm();

  const { data, isLoading } = useQueryGetLanguages();
  const createDeck = useMutationCreateDeck();
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = form.handleSubmit(async (data) => {
    createDeck
      .mutateAsync({
        languageId: parseInt(data.languageId, 10),
        name: data.name,
      })
      .then(() => {
        addToast({
          title: "Sucesso",
          description: "Deck criado com sucesso.",
          color: "success",
          shouldShowTimeoutProgress: true,
        });

        form.reset();
        setIsOpen(false);
      });
  });

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
            <Form id="form-deck" onSubmit={onSubmit}>
              <Controller
                control={form.control}
                name="name"
                render={({ field }) => (
                  <Input
                    {...field}
                    isRequired
                    label="Nome"
                    labelPlacement="outside"
                    placeholder="Digite o nome para o deck..."
                  />
                )}
              />
              <Controller
                control={form.control}
                name="languageId"
                render={({ field }) => (
                  <Select
                    {...field}
                    isRequired
                    disabled={isLoading}
                    label="Idioma"
                    labelPlacement="outside"
                    placeholder="Selecione um idioma"
                  >
                    {(data ?? []).map((language) => (
                      <SelectItem key={language.id}>{language.name}</SelectItem>
                    ))}
                  </Select>
                )}
              />
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button size="sm" onPress={() => setIsOpen(false)}>
              Fechar
            </Button>
            <Button
              color="primary"
              form="form-deck"
              isLoading={createDeck.isPending}
              size="sm"
              type="submit"
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
