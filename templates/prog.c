#include<stdio.h>
#include<conio.h>
#include<string.h>
void rotate(char str[]);
int main()
{
	char str[100];
	str=gets();
	rotate(str);
}
void rotate(char str[])
{
	char temp;
	temp=str[0];
	for(int i=1;str[i]!='\0';i++)
	{
		str[i]=str[i+1];
	}
	str[i]=temp;
	printf("%s",str);
}