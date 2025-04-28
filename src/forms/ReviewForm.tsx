import React, { useState } from "react";
import { Textarea, Button } from "@nextui-org/react";
import Form, { FormItem, FormValidations } from "reactivity-hook-form";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { ADD_REVIEW } from "../graphql/mutation/reviewMutation";
import { FaStar, FaRegStar } from "react-icons/fa"; // Importamos los íconos de estrellas

interface ReviewFormProps {
  bookId: string;
  userId: string;
}

export type ReviewFormValues = {
  rating: string;
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
    <div className="flex gap-1 mb-4">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          {star <= value ? (
            <FaStar className="w-8 h-8 text-yellow-400" /> // Estrella llena
          ) : (
            <FaRegStar className="w-8 h-8 text-gray-300" /> // Estrella vacía
          )}
        </button>
      ))}
    </div>
  );
};

const ReviewForm: React.FC<ReviewFormProps> = ({ bookId, userId }) => {
  const [rating, setRating] = useState<number>(0);
  const [addReview, { loading, error }] = useMutation(ADD_REVIEW);
  const [comment, setComment] = useState<string>("");

  const handleSubmit = async (data: ReviewFormValues) => {
    console.log("Datos enviados:", data);
    console.log("Rating seleccionado:", rating);

    if (rating === 0) {
      Swal.fire({
        title: "Error",
        text: "Debes seleccionar una calificación antes de enviar.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await addReview({
        variables: {
          data: {
            rating: rating,
            comment: data.comment,
            book: { connect: { id: bookId } },
            user: { connect: { id: userId } },
          },
        },
      });

      console.log("Respuesta del servidor:", response);
      Swal.fire({
        title: "¡Reseña enviada!",
        text: "Tu opinión ha sido registrada con éxito.",
        icon: "success",
        confirmButtonText: "OK",
      });

      setComment("");
      setRating(0);
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
      <h2 className="text-xl font-bold text-black mt-4">Deja tu reseña</h2>

      <FormItem name="comment">
        <Textarea
          label="Comentario"
          value={comment} // Vinculamos el valor del textarea al estado `comment`
          onChange={(e) => setComment(e.target.value)} // Actualizamos el estado con el comentario
          placeholder="Escribe tu opinión sobre el libro..."
          className="w-full min-h-24 resize-y rounded text-black"
          required
          variant="bordered"
          radius="sm"
        />
      </FormItem>

      <input type="hidden" name="rating" value={rating.toString()} />

      <div className="flex flex-col sm:flex-row sm:justify-between">
        <div className="w-full sm:w-auto sm:text-right">
          <StarRating value={rating} onChange={setRating}/>
        </div>

        <Button
          type="submit"
          disabled={loading || rating === 0}
          className="text-white rounded-md mt-2 sm:mt-0 sm:self-end sm:ml-4"
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
