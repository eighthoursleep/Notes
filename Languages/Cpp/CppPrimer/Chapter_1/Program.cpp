#include <iostream>

int main(){
    std::cout << "Hello I am Mingjun :)\n";
    std::cout << std::endl;

    std::clog << "This is a log :|";
    std::clog << std::endl;

    // std::cerr << "This is a error :(";
    // std::cerr << std::endl;

    int num1 = 0, num2 = 0, num3 = 0, num4 = 0;
    std::cin >> num1;
    std::cin >> num2;
    std::cin >> num3 >> num4;
    std::clog << num1 << num2 << num3 << num4 << std::endl;
    return 0;
}