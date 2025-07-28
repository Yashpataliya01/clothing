import React from "react";
import {
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  Package,
  RefreshCw,
} from "lucide-react";

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Return Policy
          </h1>
          <p className="text-gray-600">Your satisfaction is our priority</p>
        </div>

        {/* Quick Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="text-center space-y-3">
            <Clock className="w-8 h-8 text-gray-700 mx-auto" />
            <h3 className="font-medium text-gray-900">7-Day Return</h3>
            <p className="text-sm text-gray-600">Easy returns within 7 days</p>
          </div>
          <div className="text-center space-y-3">
            <Shield className="w-8 h-8 text-gray-700 mx-auto" />
            <h3 className="font-medium text-gray-900">Quality Check</h3>
            <p className="text-sm text-gray-600">Full inspection process</p>
          </div>
          <div className="text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-gray-700 mx-auto" />
            <h3 className="font-medium text-gray-900">Quick Process</h3>
            <p className="text-sm text-gray-600">Fast refund processing</p>
          </div>
        </div>

        <div className="space-y-12">
          {/* Return Window */}
          <section>
            <h2 className="text-2xl font-medium text-gray-900 mb-6">
              Return Window
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                You may return most new, unopened items within 7 days of
                delivery for a full refund.
              </p>
              <p>
                Used phones and accessories can be returned within 7 days if
                they don't meet the described condition or have undisclosed
                defects.
              </p>
            </div>
          </section>

          {/* Eligible Items */}
          <section>
            <h2 className="text-2xl font-medium text-gray-900 mb-6">
              Eligible for Return
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  New smartphones in original packaging with all accessories
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  Used phones that don't match the described condition
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  Accessories in original condition with packaging
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  Defective items with manufacturing issues
                </p>
              </div>
            </div>
          </section>

          {/* Non-Eligible Items */}
          <section>
            <h2 className="text-2xl font-medium text-gray-900 mb-6">
              Not Eligible for Return
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  Items damaged due to misuse or normal wear
                </p>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  Products without original packaging or accessories
                </p>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  Items returned after 7 days from delivery
                </p>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  Personalized or modified products
                </p>
              </div>
            </div>
          </section>

          {/* Return Process */}
          <section>
            <h2 className="text-2xl font-medium text-gray-900 mb-6">
              How to Return
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Contact Us</h3>
                  <p className="text-gray-700">
                    Call or visit our store to initiate the return process.
                    Bring your purchase receipt.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Product Inspection
                  </h3>
                  <p className="text-gray-700">
                    Our team will inspect the item to ensure it meets return
                    conditions.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Refund Processing
                  </h3>
                  <p className="text-gray-700">
                    Once approved, refunds will be processed within 3-5 business
                    days to your original payment method.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Refund Information */}
          <section>
            <h2 className="text-2xl font-medium text-gray-900 mb-6">
              Refund Information
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Refunds will be issued to the original payment method used for
                the purchase.
              </p>
              <p>
                Processing time: 3-5 business days for most payment methods.
              </p>
              <p>
                For cash purchases, refunds will be provided in cash at our
                store location.
              </p>
            </div>
          </section>

          {/* Exchange Policy */}
          <section>
            <h2 className="text-2xl font-medium text-gray-900 mb-6">
              Exchange Policy
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We offer exchanges for the same or similar products within the
                7-day return window.
              </p>
              <p>
                If exchanging for a higher-value item, you'll need to pay the
                difference.
              </p>
              <p>
                If exchanging for a lower-value item, we'll refund the
                difference.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-medium text-gray-900 mb-6">
              Questions?
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                If you have any questions about our return policy, please
                contact us:
              </p>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-500" />
                <span>
                  Visit our store: style world, Plot no.13, near nirankari
                  bhawan, Sindhu Nagar, Shastri Nagar, Bhilwara, Rajasthan
                  311001
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Our team is here to help make your return process as smooth as
                possible.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
