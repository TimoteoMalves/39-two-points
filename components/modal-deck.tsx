"use client";

import { Button } from "@heroui/button";
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
import { PropsWithChildren, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Deck,
  useMutationCreateDeck,
  useMutationUpdateDeck,
} from "@/hooks/deck/hooks";
import { useQueryGetLanguages } from "@/hooks/language/hooks";

type ModalDeckProps = {
  refetchDecks: () => void;
  deck?: Deck;
};

export function ModalDeck({
  refetchDecks,
  children,
  deck,
}: PropsWithChildren<ModalDeckProps>) {
  const form = useForm({
    defaultValues: {
      name: deck?.name || "",
      languageId: String(deck?.language_id),
    },
  });

  const { data, isLoading } = useQueryGetLanguages();
  const createDeck = useMutationCreateDeck();
  const updateDeck = useMutationUpdateDeck();
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = form.handleSubmit(async (data) => {
    if (deck && deck.id) {
      updateDeck
        .mutateAsync({
          languageId: parseInt(data.languageId, 10),
          name: data.name,
          id: deck.id,
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
          refetchDecks();
        });
    } else {
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
          refetchDecks();
        });
    }
  });

  return (
    <>
      <button onClick={() => setIsOpen(true)}>{children}</button>
      <Modal isOpen={isOpen} size="lg" onClose={() => setIsOpen(false)}>
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
                    defaultSelectedKeys={[field.value]}
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
