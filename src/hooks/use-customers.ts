
import { useQuery } from "@tanstack/react-query";
import { CustomerWithPlanDetails } from "@/types";
import { useSubscriptionStore } from "@/store/subscriptionStore";

/**
 * Custom hook to get customers with plan details
 */
export function useCustomers() {
  const getCustomerDetails = useSubscriptionStore(state => state.getCustomerDetails);
  
  const { data = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: () => {
      // Return the customer details from the store
      return getCustomerDetails();
    },
  });
  
  return data;
}
