import { useState } from "react";
import { Card, CardContent } from "@/presentation/ui/components/ui/card";
import type { ProjectClient } from "@/domain/entities/project.entity";
import type { ClientContact } from "@/domain/entities/client.entity";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, StickyNote, Star, Users, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "../ui/badge";

interface ProjectClientTabProps {
  client?: ProjectClient | null;
  contacts: ClientContact[];
}

export const ProjectClientTab = ({ client, contacts }: ProjectClientTabProps) => {
  const navigate = useNavigate();
  const [isContactsOpen, setIsContactsOpen] = useState(false);

  return (
    <>
      {client ? (
        <div className="grid gap-6">
          <Card className="border-muted/60 shadow-sm">
            <CardContent className="space-y-4">
              <div className="pt-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Cliente:
                </p>
                <p className="text-lg font-bold">{client.name}</p>
              </div>
              <Button variant="outline" size="sm" className="h-8" onClick={() => navigate(`/clientes/${client.id}`)}>
                Ficha de cliente
              </Button>
            </CardContent>
          </Card>

          <div className="border-muted/60 shadow-sm bg-card rounded-lg border overflow-hidden">
            <button
              onClick={() => setIsContactsOpen(!isContactsOpen)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-lg font-bold tracking-tight">Contactos del cliente</span>
                {contacts.length > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-primary/20">
                    {contacts.length}
                  </Badge>
                )}
              </div>
              {isContactsOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>

            {isContactsOpen && (
              <div className="p-4 pt-0 border-t border-muted/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {contacts.length > 0 ? (
                    contacts.map((contact) => (
                      <Card key={contact.id} className="">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-bold text-foreground truncate">{contact.fullName}</p>
                              {contact.isMain && (
                                <Badge className="bg-amber-500/10 text-amber-700 border-amber-200 hover:bg-amber-500/15 text-[10px] h-5">
                                  <Star className="mr-1 h-3 w-3" />
                                  Principal
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-full bg-primary/5">
                                  <Mail className="h-3.5 w-3.5 text-primary/70" />
                                </div>
                                <span className="truncate">
                                  {contact.email ? contact.email.getValue() : "Sin email"}
                                </span>
                              </div>
                              {contact.phoneNumber && (
                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 rounded-full bg-primary/5">
                                    <Phone className="h-3.5 w-3.5 text-primary/70" />
                                  </div>
                                  <span>{contact.phoneNumber}</span>
                                </div>
                              )}
                            </div>
                            {contact.note && (
                              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-background/50 p-2 rounded-md border border-muted/50">
                                <StickyNote className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground/60" />
                                <span className="italic">{contact.note}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-muted-foreground italic bg-muted/20 rounded-lg border border-dashed border-muted">
                      No hay contactos registrados para este cliente.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground italic">
              Este proyecto no tiene un cliente asignado.
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
};
