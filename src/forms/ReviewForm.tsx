import React from "react";
import { Input, Textarea, Button } from "@nextui-org/react";
import Form, { FormItem, FormValidations } from "reactivity-hook-form";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { ADD_REVIEW } from "../graphql/mutation/reviewMutation"; 

interface ReviewFormProps {
  bookId: string;
  userId: string;
}

export type ReviewFormValues = {
  rating: number;
  comment: string;
};

const validations: FormValidations<ReviewFormValues> = {
  rating: {
    required: "La calificación es obligatoria",
    min: { value: 0, message: "Debe ser mínimo 0" },
    max: { value: 5, message: "Debe ser máximo 5" },
  },
  comment: {
    required: "El comentario es obligatorio",
    minLength: { value: 10, message: "Debe tener al menos 10 caracteres" },
  },
};

const ReviewForm: React.FC<ReviewFormProps> = ({ bookId, userId }) => {
  const [addReview, { loading, error }] = useMutation(ADD_REVIEW);

  const handleSubmit = async (data: ReviewFormValues) => {
    try {
      await addReview({
        variables: {
          data: {
            rating: parseInt(data.rating.toString(), 10),
            comment: data.comment,
            book: { connect: { id: bookId } },
            user: { connect: { id: userId } },
          },
        },
      });

      Swal.fire({
        title: "¡Reseña enviada!",
        text: "Tu opinión ha sido registrada con éxito.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      console.error("Error al enviar la reseña:", err);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al enviar la reseña.",
        icon: "error",
        confirmButtonText: "Intentar de nuevo",
      });
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      validations={validations}
      className="p-6 rounded-lg w-full max-w-md shadow-lg bg-white"
    >
      <h2 className="text-xl font-bold text-black mb-4">Deja tu reseña</h2>

      <FormItem name="rating">
        <Input
          type="number"
          label="Calificación (0-5)"
          min={0}
          max={5}
          className="w-full p-2 rounded text-black"
          required
          variant="bordered"
          radius="sm"
        />
      </FormItem>

      <FormItem name="comment">
        <Textarea
          label="Comentario"
          placeholder="Escribe tu opinión sobre el libro..."
          className="w-full p-2 rounded text-black"
          required
          variant="bordered"
          radius="sm"
        />
      </FormItem>

      <Button type="submit" disabled={loading} className="mt-4 w-full">
        {loading ? "Enviando..." : "Enviar Reseña"}
      </Button>

      {error && <p className="text-red-500 mt-2">Error al enviar la reseña.</p>}
    </Form>
  );
};

export default ReviewForm;
