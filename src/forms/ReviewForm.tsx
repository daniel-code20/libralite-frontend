import React, { useState } from "react";
import { Textarea, Button } from "@nextui-org/react";
import Form, { FormItem, FormValidations } from "reactivity-hook-form";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { ADD_REVIEW } from "../graphql/mutation/reviewMutation";

interface ReviewFormProps {
  bookId: string;
  userId: string;
}

export type ReviewFormValues = {
  rating: string; // Convertimos el número a string
  comment: string;
};

const validations: FormValidations<ReviewFormValues> = {
  rating: {
    required: "La calificación es obligatoria",
  },
  comment: {
    required: "El comentario es obligatorio",
  },
};

const StarRating: React.FC<{
  value: number;
  onChange: (value: number) => void;
}> = ({ value, onChange }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <svg
            className={`w-8 h-8 transition-colors duration-200 ${
              star <= value ? "text-yellow-400 fill-current" : "text-gray-300 fill-current"
            }`}
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

const ReviewForm: React.FC<ReviewFormProps> = ({ bookId, userId }) => {
  const [rating, setRating] = useState<number>(0);
  const [addReview, { loading, error }] = useMutation(ADD_REVIEW);

  const handleSubmit = async (data: ReviewFormValues) => {
    try {
      await addReview({
        variables: {
          data: {
            rating: rating.toString(), // Convertimos el número a string
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

      setRating(0); // Reiniciar el rating después de enviar
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
    <Form onSubmit={handleSubmit} validations={validations} className="w-full">
      <h2 className="text-xl font-bold text-black mb-4">Deja tu reseña</h2>

      <FormItem name="comment">
        <Textarea
          label="Comentario"
          placeholder="Escribe tu opinión sobre el libro..."
          className="w-full min-h-32 resize-y rounded text-black"
          required
          variant="bordered"
          radius="sm"
        />
      </FormItem>

      <div className="flex items-center justify-between mb-4">
        {/* Estrellas alineadas a la izquierda */}
        <FormItem name="rating">
          <StarRating value={rating} onChange={setRating} />
        </FormItem>

        {/* Botón alineado a la derecha */}
        <Button
          type="submit"
          disabled={loading || rating === 0} // Evita enviar si no se seleccionó una calificación
          className="text-white rounded-md"
          color="primary"
        >
          {loading ? "Enviando..." : "Comentar"}
        </Button>
      </div>

      {error && <p className="text-red-500 mt-2">Error al enviar la reseña.</p>}
    </Form>
  );
};

export default ReviewForm;
