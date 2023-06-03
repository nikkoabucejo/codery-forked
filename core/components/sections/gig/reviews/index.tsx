"use client";
import Button from "@core/components/elements/button";
import Field from "@core/components/elements/field";
import {
  Category,
  Client,
  Freelancer,
  Gig,
  Review as ReviewType,
  Skill,
  Tag,
  Technology,
  Thumbnail,
  User,
} from "@prisma/client";
import { useState } from "react";
import Review from "./review";

type Props = {
  user:
    | (User & {
        freelancer: Freelancer | null;
      })
    | null;
  gig:
    | (Gig & {
        freelancer: Freelancer & {
          user: User;
          skills: (Skill & {
            technology: Technology | null;
          })[];
        };
        category: Category;
        thumbnails: Thumbnail[];
        reviews: (ReviewType & {
          User: User;
        })[];
        tags: Tag[];
      })
    | null;
};

const Reviews = ({ user, gig }: Props) => {
  const [fields, setFields] = useState({
    message: "",
    rating: 0,
  });

  const handleCreateReview = async () => {
    try {
      await fetch(`/api/gigs/${gig?.id}/create-review`, {
        method: "POST",
        body: JSON.stringify({
          message: fields.message,
          rating: fields.rating,
          gigId: gig?.id,
          userId: user?.id,
        }),
      });
      setFields({ message: "", rating: 0 });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="contain space-y-8">
      {gig?.freelancer.userId !== user?.id ? (
        <section className="space-y-4">
          <Field.Body
            id="message"
            label="Message"
            description="What is your review?">
            <Field.Textarea
              id="message"
              isFull
              placeholder="Your Review here"
              value={fields.message}
              onChange={(event) =>
                setFields({ ...fields, message: event.target.value })
              }
            />
          </Field.Body>

          <Field.Body
            id="rating"
            label="Rating"
            description="How many will you rate this freelancer?">
            <Field.Number
              id="rating"
              isFull
              value={fields.rating}
              onChange={(event) =>
                setFields({ ...fields, rating: +event.target.value })
              }
            />
          </Field.Body>
          <Button onClick={handleCreateReview}>Post Review</Button>
        </section>
      ) : null}

      <section className="w-full space-y-4">
        <h1 className="text-xl font-bold">Reviews</h1>
        <div className=" flex items-center gap-3">
          {gig?.reviews.map((review) => (
            <Review
              key={review.id}
              name={review.User.name!}
              location={review.User.location!}
              image={review.User.image!}
              message={review.message}
              rating={review.rating}
            />
          ))}
        </div>
      </section>
    </section>
  );
};

export default Reviews;
