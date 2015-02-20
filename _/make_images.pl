use strict;
use warnings;

use Image::Thumbnail;

my $dir = '_/img/';
my $DIR;
opendir $DIR, $dir;
foreach my $file (readdir $DIR){
    next if $file =~ /^\.+$/;
    next if $file =~ /_\d{3}\.png$/;
    my $path = $dir .'/'. $file;
    warn "Do $path";

    foreach my $size (qw( 200 400 )){
        new Image::Thumbnail(
            size       => 200,
            create     => 1,
            input      => $path,
            outputpath => $path . '_'.$size.'.png'
        );
    }
}


