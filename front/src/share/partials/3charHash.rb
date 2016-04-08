#newestUser will be an array [a,a,b], where the order of arrays is [array3 selection, array2 selection, array1 selection]

array1 = [a,b,c,d,e,f]
array2 = array1
array3 = array2

def increment (newestUser)
      
    if getArrayPosition.newestUser[2] != array1.length() #if not at the end of the last array, increment
      newestUser[2] = array1[getArrayPosition.newestUser[2] + 1]
    elsif getArrayPosition.newestUser[1] != array2.length() #if at the end last array, try the 2nd to last array, and increment
      newestUser[1] = array1[getArrayPosition.newestUser[1] + 1]
      #and also reset the last array/counter
      newestUser[2] = array1[0]
    else 
      #if this is written correctly, only if newestUser is [*,f,f] wlil it get here
      #if so, reset the last and 2nd to last counter and increment the first counter
      newestUser[2] = array1[0]
      newestUser[1] = array1[0]
      newestUser[0] = array1[getArrayPosition.newestUser[0] + 1]
    end

    return newestUser
end
