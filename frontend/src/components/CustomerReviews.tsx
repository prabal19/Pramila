"use client";

import React from 'react';
import { Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const reviews = [
  {
    id: 1,
    author: 'Jagarti Tejwani',
    date: '06/03/2025',
    rating: 5,
    title: '',
    text: 'Team is very good and fast, they delivered my item in 48 hours and it was perfect!',
  },
  {
    id: 2,
    author: 'Shruti Chaturvedi',
    date: '05/23/2025',
    rating: 5,
    title: 'Amazing clothes and design',
    text: 'The orders are always on point and on time and just PERFECT!',
  },
  {
    id: 3,
    author: 'Prernna',
    date: '05/20/2025',
    rating: 5,
    title: 'Beautiful Collection',
    text: 'The quality of the fabric is exceptional. I received so many compliments!',
  },
  {
    id: 4,
    author: 'Anjali Sharma',
    date: '05/15/2025',
    rating: 5,
    title: 'Stunning Design',
    text: 'Absolutely in love with my new saree. The design is even more beautiful in person.',
  },
  {
    id: 5,
    author: 'Priya Patel',
    date: '05/10/2025',
    rating: 5,
    title: 'Fits Perfectly!',
    text: 'Stunning design and fits perfectly. Will definitely shop again!',
  },
];

const StarRating = ({ rating, className }: { rating: number, className?: string }) => {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < rating ? 'text-black fill-current' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

const CustomerReviews = () => {
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
      const count = reviews.filter(r => r.rating === star).length;
      return { star, count, percentage: (count / totalReviews) * 100 };
  })

  return (
    <section id="customer-reviews" className="bg-white py-20 scroll-mt-28">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-headline text-center mb-12" style={{fontFamily: "'Cormorant Garamond', serif"}}>
          Customer Reviews
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-10">
            <div className="md:col-span-3 flex flex-col items-center text-center">
                <StarRating rating={averageRating} />
                <p className="font-semibold mt-2">{averageRating.toFixed(2)} out of 5</p>
                <p className="text-sm text-muted-foreground">Based on {totalReviews} reviews</p>
            </div>
            <div className="md:col-span-6">
                {ratingDistribution.map(({star, count, percentage}) => (
                    <div key={star} className="flex items-center gap-4 text-sm mb-1">
                        <div className="flex items-center gap-1 w-16 text-sm">
                            <span>{star}</span>
                            <Star className="w-3 h-3 text-black fill-current" />
                        </div>
                        <Progress value={percentage} className="h-2 w-full bg-gray-200" />
                        <span className="w-8 text-right text-muted-foreground text-sm">{count}</span>
                    </div>
                ))}
            </div>
            <div className="md:col-span-3 flex justify-center">
                <Button className="bg-[#1a1a1a] hover:bg-black text-white rounded-md tracking-wider font-semibold px-8 py-3 h-auto">
                    Write a review
                </Button>
            </div>
        </div>

        <Separator className="my-8 bg-gray-200" />
        
        <div className="flex justify-end mb-8">
            <Select defaultValue="most-recent">
                <SelectTrigger className="w-[180px] rounded-md border-gray-300 focus:ring-primary">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="most-recent">Most Recent</SelectItem>
                    <SelectItem value="highest-rating">Highest Rating</SelectItem>
                    <SelectItem value="lowest-rating">Lowest Rating</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div className="space-y-8">
          {reviews.map((review, index) => (
            <React.Fragment key={review.id}>
              <div>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <StarRating rating={review.rating} />
                            <p className="font-semibold mt-1">{review.author}</p>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.date}</p>
                </div>
                <div className="pl-14 mt-2">
                  {review.title && <h4 className="font-semibold mb-1">{review.title}</h4>}
                  <p className="text-muted-foreground leading-relaxed">{review.text}</p>
                </div>
              </div>
              {index < reviews.length - 1 && <Separator className="mt-8 bg-gray-200" />}
            </React.Fragment>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CustomerReviews;
