#include <stdio.h>
#include <stdlib.h>
#include <time.h>
//generally i is row, j is col =/=/= diamond[row][col]


int** recursiveGeneration(int** previous, int n, int remaining);
void printArray(int **input, int size);


int main(int argc, char* argv[]){
    int order=atoi(argv[1]);

    int** base = (int**)malloc(2 * sizeof(int*));
    for (int i = 0; i < 2; i++) {
        base[i] = (int*)malloc(2 * sizeof(int));
        for (int j = 0; j < 2; j++) {
            base[i][j] = 0; // Initialize base with -1
        }
    }

    int** tiling = (int**)malloc(order * 2 * sizeof(int*));
    for (int i = 0; i < order * 2; i++) {
        tiling[i] = (int*)malloc(order * 2 * sizeof(int));
    }

    printArray(base, 2);

    srand(time(NULL));

    tiling = recursiveGeneration(base, 0, order);

    printArray(tiling, 4);
}

//start with array of all zeros (ZERO MEANS HOLE -1 MEANS BOUNDARY)
//when you expand the array, you need to find the surroundings of all vertices that 
//aren't 0 (-1 = empty, every other number is a domino)
//if the vetex value isn't -1, check surrounding vertices, make them 0 (expanding process changes boundaries)


//when iterations is 0, the array size is [0+2][0+2]
//n [2n+2][2+2]
int** recursiveGeneration(int** previous, int n, int remaining){
    //generate new array to enlarge and eventually fill / transfer
    int** inflated = (int**)malloc(2*n+4 * sizeof(int*));
    for (int i = 0; i < 2*n+4; i++) {
        inflated[i] = (int*)malloc(2*n+4 * sizeof(int));
        for (int j = 0; j < 2*n+4; j++) {
            inflated[i][j] = -1; //full of boundary initially
        }
    }

    
    //fill holes left from previous
    for(int i = 0; i<2*n+2; i++){
        for(int j = 0; j<2*n+2; j++){
            if(previous[i][j]==0){ //hole has been reached when going from top left to bottom right
                //coin flip for domino block
                if(rand()%2){   //two horizontal
                    previous[i][j]   = 1; previous[i][j+1]   = 3;
                    previous[i+1][j] = 1; previous[i+1][j+1] = 3;
                }
                else{           //two vertical
                    previous[i][j]   = 2; previous[i][j+1]   = 2;
                    previous[i+1][j] = 4; previous[i+1][j+1] = 4;
                }
            }
        }
    }

    printArray(previous, 2);

    //holes filled, check if recursion is complete
    if(remaining == 0)
        return previous;

    //destruction step
    //iterate from top left to bottom right, check each horizontal domino if it's south
    //if it's south, check if the domino directly below it is also horizontal, if so, delete the block
    //(stop this checking at the bottom row since you're done)

    //then do the same shit scanning from top left to bottom right (skipping rightmost col)
    //if it's an east domino, check if the domino directly to the right is vertical as well
    //if so, delete it


    return recursiveGeneration(inflated, ++n, --remaining);
}


void printArray(int **input, int size){
    for(int i=0; i<size;i++){
        for(int j=0; j<size;j++){
            printf("[ %d ]",input[i][j]);
        }
        printf("\n");
    }
}