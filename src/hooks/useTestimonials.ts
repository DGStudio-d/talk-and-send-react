import { useTestimonials as useTestimonialsQuery } from "@/services";

/**
 * Backwards-compatible hook used by the existing Testimonials component.
 * Wraps React Query hook and exposes the legacy {data, loading, error, refetch} shape.
 */
export const useTestimonials = () => {
  const query = useTestimonialsQuery();

  return {
    data: query.data,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export default useTestimonials;
