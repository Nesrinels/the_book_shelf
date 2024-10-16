import React from 'react';
import { Zap, Shield, ThumbsUp, Star } from 'lucide-react';

const FeatureItem = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-4">
    <div className="bg-emerald-100 p-3 rounded-lg mb-4">
      <Icon className="w-6 h-6 text-emerald-500" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const FeatureSection = () => {
  const features = [
    {
      icon: Zap,
      title: 'Quick Delivery',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'
    },
    {
      icon: ThumbsUp,
      title: 'Best Quality',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'
    },
    {
      icon: Star,
      title: 'Return Guarantee',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureItem key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;