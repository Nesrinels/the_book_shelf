import React from 'react';
import { Star, Share2, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function BookProductPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-8">
      {/* Left column - Book images */}
      <div className="md:w-1/2">
        <div className="mb-4">
          <img 
            src="/api/placeholder/400/500" 
            alt="Book cover" 
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <img 
              key={i}
              src="/api/placeholder/150/150" 
              alt={`Book preview ${i}`}
              className="w-full rounded-lg shadow"
            />
          ))}
        </div>
      </div>

      {/* Right column - Book details */}
      <div className="md:w-1/2">
        <div className="mb-4">
          <h1 className="text-3xl font-bold mb-2">Glittering Stars</h1>
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} fill="currentColor" className="w-5 h-5" />
              ))}
            </div>
            <span className="ml-2 text-gray-600">(20 Reviews)</span>
          </div>
          <div className="flex items-center mb-4">
            <span className="text-gray-500 line-through mr-2">$55.00</span>
            <span className="text-2xl font-bold text-blue-600">$75.00</span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tempor facilisis lacus, quis 
            hendrerit ex. Cras luctus lorem at ornare varius.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-sm text-gray-500">Publisher</h3>
            <p>Jamoon Publication</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">ISBN-10</h3>
            <p>0123456789</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Publish Date</h3>
            <p>October 20, 2022</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500">ISBN-13</h3>
            <p>978-0123456789</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center border rounded-md">
            <button className="px-3 py-2 text-gray-600 hover:bg-gray-100">-</button>
            <span className="px-3 py-2">1</span>
            <button className="px-3 py-2 text-gray-600 hover:bg-gray-100">+</button>
          </div>
          <Button className="flex-1">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <img 
                src="/api/placeholder/50/50" 
                alt="Author" 
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold">Hossain Sayem</h3>
                <p className="text-sm text-gray-500">Author & Writer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="summary" className="mt-8">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="specification">Specification</TabsTrigger>
            <TabsTrigger value="authors">Authors</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="summary">
            <table className="w-full">
              <tbody>
                {[
                  ['Title', 'Glittering Stars'],
                  ['Author', 'Hossain Sayem'],
                  ['Publisher', 'Another publication'],
                  ['ISBN', '9789400205206'],
                  ['Edition', '7th Printed, 2022'],
                  ['Number of Pages', '854'],
                  ['Country', 'United State'],
                  ['Language', 'English, Bangla, Hindi'],
                ].map(([key, value]) => (
                  <tr key={key} className="border-b">
                    <td className="py-2 text-gray-500">{key}</td>
                    <td className="py-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}