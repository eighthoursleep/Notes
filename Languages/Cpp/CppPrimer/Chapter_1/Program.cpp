#include <iostream>
#include <string>
using namespace std;

void test(int len = 10){
    for (int i = 0; i < len; ++i)
    {
        cout << i << endl;
    }
}

int main(){
    test(3);
    test();
}
