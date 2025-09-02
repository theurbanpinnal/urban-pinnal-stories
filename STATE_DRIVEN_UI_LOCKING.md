# State-Driven UI Locking Strategy for Product Actions

This document outlines the implementation of a robust state-driven UI locking strategy for preventing race conditions in e-commerce product actions.

## Overview

The strategy uses local UI state to act as a "lock," preventing users from triggering multiple actions simultaneously while maintaining a smooth user experience.

## Core Principles

1. **Immediate State Change**: Set processing state immediately when action starts
2. **UI Lock**: Disable all action buttons during processing
3. **Visual Feedback**: Show loading indicators on the active button
4. **Guaranteed Reset**: Always reset state in `finally` block
5. **Extra Safeguards**: Check processing state before starting new actions

## Implementation Examples

### ProductPage Component

```typescript
// Action status type for UI locking
type ActionStatus = 'idle' | 'adding' | 'buying';

const ProductPage: React.FC = () => {
  // State-driven UI locking system
  const [actionStatus, setActionStatus] = useState<ActionStatus>('idle');
  
  // Computed property to check if any action is processing
  const isProcessing = actionStatus !== 'idle';

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) {
      toast({
        title: 'Selection Required',
        description: 'Please select a product variant before proceeding.',
        variant: 'destructive',
      });
      return;
    }
    
    setActionStatus('adding'); // 1. Immediately lock the UI
    try {
      const success = await addToCart(selectedVariant.id, quantity);
      if (success) {
        toast({
          title: 'Added to Cart',
          description: 'Item has been added to your cart successfully.',
        });
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setActionStatus('idle'); // 3. ALWAYS unlock the UI
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant?.id) {
      toast({
        title: 'Selection Required',
        description: 'Please select a product variant before proceeding.',
        variant: 'destructive',
      });
      return;
    }

    setActionStatus('buying'); // 1. Immediately lock the UI
    try {
      const success = await addToCart(selectedVariant.id, quantity);
      if (success) {
        // Add a small delay to ensure cart state is updated
        setTimeout(() => {
          checkout();
          setActionStatus('idle');
        }, 800);
      } else {
        setActionStatus('idle');
      }
    } catch (error) {
      console.error('Failed to buy now:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
      setActionStatus('idle');
    }
  };

  return (
    <div className="space-y-4 pt-6">
      <Button
        onClick={handleAddToCart}
        disabled={outOfStock || cartLoading || (variants.length > 1 && !selectedVariantId) || isProcessing}
        className="w-full font-sans text-lg font-semibold py-4 h-14 bg-background text-foreground border-2 border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
        variant="outline"
      >
        {actionStatus === 'adding' ? (
          <>
            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
            Adding to Cart...
          </>
        ) : (
          <>
            <ShoppingCart className="mr-3 h-6 w-6" />
            {outOfStock ? 'Out of Stock' : 
             variants.length > 1 && !selectedVariantId ? 'Select Variant' : 
             'Add to cart'}
          </>
        )}
      </Button>

      <Button
        onClick={handleBuyNow}
        disabled={outOfStock || cartLoading || isProcessing || (variants.length > 1 && !selectedVariantId)}
        className="w-full font-sans text-lg font-semibold py-4 h-14 bg-foreground text-background hover:bg-foreground/90 transition-all duration-300"
      >
        {actionStatus === 'buying' ? (
          <>
            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Zap className="mr-3 h-6 w-6" />
            {outOfStock ? 'Out of Stock' : 
             variants.length > 1 && !selectedVariantId ? 'Select Variant' : 
             'Buy it now'}
          </>
        )}
      </Button>
    </div>
  );
};
```

### CartActions Component

```typescript
// Action status type for cart operations
type CartActionStatus = 'idle' | 'updating' | 'removing';

const CartActions: React.FC<CartActionsProps> = ({ 
  line, 
  onQuantityChange, 
  onRemove, 
  isLoading 
}) => {
  const [actionStatus, setActionStatus] = useState<CartActionStatus>('idle');
  
  // Computed property to check if any action is processing
  const isProcessing = actionStatus !== 'idle' || isLoading;

  const handleQuantityChange = async (lineId: string, newQuantity: number) => {
    if (isProcessing) return; // Extra safeguard
    
    setActionStatus('updating');
    try {
      await onQuantityChange(lineId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setActionStatus('idle');
    }
  };

  const handleRemove = async (lineId: string) => {
    if (isProcessing) return; // Extra safeguard
    
    setActionStatus('removing');
    try {
      await onRemove(lineId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setActionStatus('idle');
    }
  };

  return (
    <div className="grid grid-cols-4 sm:grid-cols-4 gap-3 sm:gap-4 py-3 sm:py-4 border-b cart-item-compact items-center">
      {/* Quantity Controls with State-Driven UI Locking */}
      <div className="col-span-4 sm:col-span-1 flex items-center gap-1 sm:gap-2 cart-quantity-controls justify-center sm:justify-center mt-3 sm:mt-0">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8"
          onClick={() => handleQuantityChange(line.id, line.quantity - 1)}
          disabled={isProcessing}
        >
          {actionStatus === 'updating' ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Minus className="h-3 w-3" />
          )}
        </Button>
        
        <Select
          value={line.quantity.toString()}
          onValueChange={(value) => handleQuantityChange(line.id, parseInt(value))}
          disabled={isProcessing}
        >
          <SelectTrigger className="w-14 sm:w-16 h-7 sm:h-8 text-xs sm:text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8"
          onClick={() => handleQuantityChange(line.id, line.quantity + 1)}
          disabled={isProcessing}
        >
          {actionStatus === 'updating' ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Plus className="h-3 w-3" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8 text-red-500 hover:text-red-700 hover:bg-red-50 ml-1 sm:ml-2"
          onClick={() => handleRemove(line.id)}
          disabled={isProcessing}
        >
          {actionStatus === 'removing' ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Trash2 className="h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  );
};
```

## Benefits

1. **Prevents Race Conditions**: Users cannot trigger multiple actions simultaneously
2. **Better UX**: Clear visual feedback during processing
3. **Robust Error Handling**: UI always returns to idle state
4. **Consistent Behavior**: Same pattern across all action types
5. **Easy to Maintain**: Centralized state management

## Best Practices

1. **Always use `finally`**: Ensure state reset even on errors
2. **Extra safeguards**: Check processing state before starting actions
3. **Specific status types**: Use distinct status for each action type
4. **Visual feedback**: Show loading indicators on active buttons
5. **Consistent patterns**: Apply the same strategy across components

## Migration Guide

To implement this strategy in existing components:

1. Replace boolean loading states with action status enums
2. Add `finally` blocks to all async operations
3. Update button disabled conditions to include processing state
4. Add loading indicators with specific action status checks
5. Test edge cases and error scenarios
